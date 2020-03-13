var dropzoneInput = (function ($) {
    return {
        config: {},
        options: {},
        dropzone: null,
        initialize: function (config, options) {
            var self = this;
            this.config = config;

            var defaults = {
                sending: function (file, xhr, formData) {
                    if (dropzoneInput.config.enableSort) {
                        $('.dropzone-input-wrapper.dz-clickable.dz-started').sortable("disable");
                    }

                    formData.append(yii.getCsrfParam(), yii.getCsrfToken());
                },
                successmultiple: function (files, xhr) {
                    if (xhr.success !== true) {
                        return;
                    }
                    $.each(files, function (key) {
                        files[key].id = xhr.data[key].image_id;
                        self.config.files.push({
                            id: xhr.data[key].image_id
                        });
                    });
                    self.updateInput();
                },
                removedfile: function (file) {
                    self.showMessageDiv(false);
                    main.ui.confirm('Hey, you sure?').then(function (response) {
                        if (!response.value) {
                            return false;
                        }
                        self.config.files = self.config.files.filter(function (item) {
                            return item.id !== file.id;
                        });

                        $(file.previewElement).remove();
                        self.updateInput();

                        if (dropzoneInput.dropzone.options.maxFiles > dropzoneInput.config.files.length) {
                            $(dropzoneInput.dropzone.element).removeClass('dz-max-files-reached');
                        }
                    });
                },
                queuecomplete: function () {
                    if (dropzoneInput.config.enableSort) {
                        $('.dropzone-input-wrapper.dz-clickable.dz-started').sortable("enable");
                    }
                }
            };

            if (this.config.enableCrop) {
                defaults.transformFile = function (file, done) {
                    // Create Dropzone reference for use in confirm button click handler
                    var myDropZone = this;
                    // Create the image editor overlay
                    var editor = document.createElement('div');
                    editor.style.position = 'fixed';
                    editor.style.left = 0;
                    editor.style.top = "25%";
                    editor.style.zIndex = 9999;

                    editor.style.backgroundColor = '#000';
                    editor.classList.add("col-lg-4");
                    editor.classList.add("offset-lg-4");
                    editor.classList.add("p-0");
                    editor.classList.add("h-50");
                    document.body.appendChild(editor);

                    // Create confirm button at the top left of the viewport
                    var buttonConfirm = document.createElement('button');
                    buttonConfirm.classList.add("btn");
                    buttonConfirm.classList.add("btn-primary");
                    buttonConfirm.classList.add("btn-sm");
                    buttonConfirm.style.position = 'absolute';
                    buttonConfirm.style.width = "75px";
                    buttonConfirm.style.bottom = "-40px";
                    buttonConfirm.style.right = "-5px";
                    buttonConfirm.style.zIndex = 9999;
                    buttonConfirm.textContent = 'Confirm';

                    editor.appendChild(buttonConfirm);

                    var buttonCancel = document.createElement('button');
                    buttonCancel.classList.add("btn");
                    buttonCancel.classList.add("btn-default");
                    buttonCancel.classList.add("btn-sm");
                    buttonCancel.style.position = 'absolute';
                    buttonCancel.style.width = "75px";
                    buttonCancel.style.bottom = "-40px";
                    buttonCancel.style.right = "80px";
                    buttonCancel.style.zIndex = 9999;
                    buttonCancel.textContent = 'Cancel';

                    editor.appendChild(buttonCancel);


                    buttonConfirm.addEventListener('click', function () {
                        // Get the canvas with image data from Cropper.js
                        var canvas = cropper.getCroppedCanvas({});
                        // Turn the canvas into a Blob (file object without a name)
                        canvas.toBlob(function (blob) {
                            // Create a new Dropzone file thumbnail
                            myDropZone.createThumbnail(
                                blob,
                                myDropZone.options.thumbnailWidth,
                                myDropZone.options.thumbnailHeight,
                                myDropZone.options.thumbnailMethod,
                                false,
                                function (dataURL) {

                                    // Update the Dropzone file thumbnail
                                    myDropZone.emit('thumbnail', file, dataURL);
                                    // Return the file to Dropzone
                                    done(blob);
                                });
                        });
                        // Remove the editor from the view
                        document.body.removeChild(editor);
                    });

                    buttonCancel.addEventListener('click', function () {

                        dropzoneInput.dropzone.files.splice( dropzoneInput.dropzone.files.indexOf(file), 1 );
                        dropzoneInput.dropzone.processQueue();
                        $(file.previewElement).remove();
                        document.body.removeChild(editor);
                    });

                    // Create an image node for Cropper.js
                    var image = new Image();
                    image.src = URL.createObjectURL(file);
                    editor.appendChild(image);

                    // Create Cropper.js
                    var cropper = new Cropper(image, {aspectRatio: 1});
                }
            }

            this.options = $.extend({}, defaults, options);

            this.dropzone = new Dropzone(this.config.el, this.options);

            this.initExistingFiles();
            this.updateInput();

            if (this.config.enableRotate) {
                $(document).on('click', '.rotate-btn', this.rotate);
            }

            if (this.config.enablePreview) {
                $('body').removeClass('show-mfp');
                this.initializePreviewImagePopup();

                $(document).on('click', '.dz-preview.dz-complete', function (event) {
                    event.preventDefault();
                    var itemId = parseInt($(this).attr('data-id'));
                    var mfpInstance = $.magnificPopup.instance;
                    var currItem = mfpInstance.items.find(x => x.data ? (x.data.id === itemId) : (x.id === itemId));

                    if (!currItem && currItem.data == null) {
                        var newUrl = (dropzoneInput.options.imageUrl + '?id=' + itemId + '&spec=w99999');
                        currItem = {
                            data: {
                                src: !currItem.src ? newUrl : currItem.src,
                                id: itemId,
                                type: 'image',
                                index: mfpInstance.items.length
                            }, id: itemId, src: newUrl, type: 'image', index: mfpInstance.items.length
                        };
                        mfpInstance.items.push(currItem);
                    }

                    if (!mfpInstance.currTemplate) {
                        mfpInstance.currTemplate = {};
                        mfpInstance.currTemplate['image'] = false;
                    }

                    $('.dz-details').magnificPopup('open');

                    mfpInstance.goTo(currItem.index);
                    if (mfpInstance.items) mfpInstance.updateItemHTML();
                });

                $(self.dropzone.element).ready(function () {
                    $(this).find('.dz-details').magnificPopup('open');
                });
            }

            if (this.config.enableSort) {
                $('.dropzone-input-wrapper').sortable({
                    stop: function (event, ui) {
                        dropzoneInput.updateFilesFromElements();
                        dropzoneInput.updateInput();
                    }
                });
            }
        },
        initExistingFiles: function () {
            var self = this;

            $.each(self.config.files, function (key, file) {
                self.dropzone.emit('addedfile', file);
                self.dropzone.emit('complete', file);
                self.dropzone.emit('thumbnail', file, file.url);
            });
        },
        initializePreviewImagePopup: function () {
            var el = this.dropzone.element;
            $(el).find('.dz-preview .dz-details').magnificPopup(this.config.magnificPopupOptions);
        },
        updateInput: function () {
            var ids = [];
            var self = this;

            $.each(self.config.files, function (key, file) {
                ids.push(file.id);
            });

            self.config.files.reverse();
            $.each(self.config.files, function (key, file) {
                var dropzoneChildren = $(dropzoneInput.dropzone.element).children();
                $(dropzoneChildren[dropzoneChildren.length - (key + 1)]).attr('data-id', file.id);
            });
            self.config.files.reverse();

            $(self.config.input).val(JSON.stringify(ids));

            if (ids.length === 0) {
                self.showMessageDiv(true);
            }
        },
        showMessageDiv: function (show) {
            if (show) {
                $(this.config.el + ' .dz-message').show();
            } else {
                $(this.config.el + ' .dz-message').hide();
            }
        },
        updateFilesFromElements: function () {
            var dropzoneChildren = $(dropzoneInput.dropzone.element).children();
            var updatedFiles = [];
            $.each(dropzoneChildren.get().reverse(), function (key, element) {
                var oldFiles = dropzoneInput.config.files;
                var id = parseInt($(element).attr('data-id'));
                if (id) {
                    var updatedFile = oldFiles.find(x => x.id === id);
                    if (updatedFile) {
                        updatedFiles.push(updatedFile);
                    }
                }
            });
            updatedFiles.reverse();
            dropzoneInput.config.files = updatedFiles;
        },
        rotate: function () {
            var rotateButton = $(this);
            var boxElement = rotateButton.closest('.dz-image-preview');
            var bothButtons = boxElement.find('.rotate-btn');

            if (rotateButton.hasClass('disabled')) {
                return;
            } else {
                for (let i = 0; i < bothButtons.length; i++) {
                    dropzoneInput.beginLoading($(bothButtons[i]));
                }
            }

            var imgElement = boxElement.find('img');
            var direction = rotateButton.attr('data-rotate-direction');
            var amount = parseInt(imgElement.attr('data-rotation-amount'));
            var newAmount;
            var indexPosition = boxElement.index() - 2;

            var imageIdsInputElement = $(this).closest('.dropzone-input-wrapper').find('#listingform-imageids');
            var imageIdsString = imageIdsInputElement.attr('originalvalue') || imageIdsInputElement.attr('value');
            var imageIdsArray = JSON.parse(imageIdsString);
            var imageId = imageIdsArray[indexPosition];

            if (direction === 'right') {
                newAmount = (amount + 90) >= 360 ? 0 : (amount + 90);
            } else {
                newAmount = (amount - 90) <= -360 ? 0 : (amount - 90);
            }

            $.get(dropzoneInput.options.rotateUrl + '?id=' + imageId + '&angle=' + (direction === 'right' ? 90 : -90), function (data, status) {
                if (status === 'success') {
                    dropzoneInput.rotateImgElement(imgElement, newAmount);
                }

                for (let i = 0; i < bothButtons.length; i++) {
                    dropzoneInput.stopLoading($(bothButtons[i]));
                }
            });
        },
        rotateImgElement: function (imgElement, newAmount) {
            imgElement.attr('data-rotation-amount', newAmount);
            imgElement.css({
                '-webkit-transform': 'rotate(' + newAmount + 'deg)',
                '-moz-transform': 'rotate(' + newAmount + 'deg)',
                'transform': 'rotate(' + newAmount + 'deg)'
            });
        },
        beginLoading: function (item) {
            item.addClass('disabled');
            item.attr('disabled', true);
            item.find('i').attr('data-initial-class', item.find('i').attr('class'));
            item.find('i').attr('class', 'fa fa-spinner fa-spin text-shadow');
        },
        stopLoading: function (item) {
            item.removeClass('disabled');
            item.removeAttr('disabled');
            item.find('i').attr('class', item.find('i').attr('data-initial-class'));
            item.find('i').removeAttr('data-initial-class');
        },
    };
})(jQuery);



