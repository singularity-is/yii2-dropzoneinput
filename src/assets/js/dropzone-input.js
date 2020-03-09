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
                    $('.blackbox-dropzone.dz-clickable.dz-started').sortable("disable");
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
                    });
                },
                queuecomplete: function () {
                    $('.blackbox-dropzone.dz-clickable.dz-started').sortable("enable");
                }
            };

            this.options = $.extend({}, defaults, options);

            this.dropzone = new Dropzone(this.config.el, this.options);

            this.initExistingFiles();
            this.updateInput();
            this.initializePreviewImagePopup();

            $(document).on('click', '.dz-preview.dz-complete', function (event) {
                event.preventDefault();
                var itemId = parseInt($(this).attr('data-id'));
                var mfpInstance = $.magnificPopup.instance;
                var currItem = mfpInstance.items.find(x => x.data ? (x.data.id === itemId) : (x.id === itemId));

                if (!currItem) {
                    var newUrl = (dropzoneInput.options.imageUrl + '?id=' + itemId + '&spec=w99999');
                    currItem = {
                        data: {
                            src: newUrl,
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

            $('.blackbox-dropzone').sortable({
                stop: function (event, ui) {
                    dropzoneInput.updateFilesFromElements();
                    dropzoneInput.updateInput();
                }
            });

            $(self.dropzone.element).ready(function () {
                $(this).find('.dz-details').magnificPopup('open');
            });
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
        }
    };
})(jQuery);



