# Dropzone Input Widget for Yii2

[![Latest Version](https://img.shields.io/github/tag/singularity-is/yii2-dropzoneinput.svg?style=flat-square&label=release)](https://github.com/singularity-is/yii2-dropzoneinput/tags)
[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE.md)
[![Build Status](https://img.shields.io/travis/singularity/yii2-dropzoneinput/master.svg?style=flat-square)](https://travis-ci.org/singularity/yii2-dropzoneinput)
[![Coverage Status](https://img.shields.io/scrutinizer/coverage/g/singularity/yii2-dropzoneinput.svg?style=flat-square)](https://scrutinizer-ci.com/g/singularity/yii2-dropzoneinput/code-structure)
[![Quality Score](https://img.shields.io/scrutinizer/g/singularity/yii2-dropzoneinput.svg?style=flat-square)](https://scrutinizer-ci.com/g/singularity/yii2-dropzoneinput)
[![Total Downloads](https://img.shields.io/packagist/dt/singularity/yii2-dropzoneinput.svg?style=flat-square)](https://packagist.org/packages/singularity/yii2-dropzoneinput)

Renders a [Dropzone Input](http://www.dropzone.js) widget.

## Installation

The preferred way to install this extension is through [composer](http://getcomposer.org/download/).

Either run

```bash
$ composer require singularity/yii2-dropzoneinput:~1.0
```

or add

```
"singularity/yii2-dropzoneinput": "~1.0"
```

to the `require` section of your `composer.json` file.

## Usage

Using with ActiveForm

```
use singularity\dropzoneinput\DropzoneInput;

...

<?= $form->field($model, 'imageIds'])->widget(DropzoneInput::class, [
    'files' => $data
]); ?>
```

Using without ActiveForm

```
use singularity\dropzoneinput\DropzoneInput;

...

<?= DropzoneInput::widget([
    'model' => $model,
    'attribute' => 'imageIds',
    'files' => $data
]) ?>
```

## Options

#### Preload Files
Example:
```
[
    'files' => $files // default empty
]
```
Expected file format:
```
$file = [
    'id' => 100,
    'name' => 'My image',
    'size' => 5,
    'status' => 'success',
    'url' => Url::to(['/image/view', 'id' => 100, 'spec' => 'w120']), // dropzone thumbnail image url
    'src' => Url::to(['/image/view', 'id' => 100, 'spec' => 'w1200']) // full preview image url
];
```

#### Highlight First Item
Example:
```
[
    'highlightFirst' => true // default false
]
```

#### Enable Rotation
Example:
```
[
    'enableRotate' => true // default false
    'clientOptions' => [
        'rotateUrl' => Url::to(['/image/rotate'])
    ]
]
```

#### Enable Preview
Example:
```
[
    'enablePreview' => true // default false
]
```

#### Enable Sort
Example:
```
[
    'enableSort' => true // default true
]
```

#### Enable Crop
Example:
```
[
    'enableCrop' => true // default false,
    'cropperOptions' => [
        'aspectRatio' => 1.4
    ],
    'clientOptions' => [
        'parallelUploads' => 1 // default 2 (it is recommended to set this to 1 when using crop)
    ],
    'beforeCrop' => new JsExpression("function() {
        console.log('Just before image is cropped!');
    }"),
]
```

#### Custom Remove Message
Example:
```
[
    'removeMessage' => 'Are you sure you want to delete image?' //this is the default
]
```
see [Cropper.JS](https://github.com/fengyuanchen/cropperjs/blob/master/README.md) for full documentation

## Contributing

Please see [CONTRIBUTING](CONTRIBUTING.md) for details.

## Credits

- [Dositej Grbovic](https://dositej-dev.com)
- [All Contributors](https://github.com/singularity-is/yii2-dropzoneinput/graphs/contributors)

## License

The BSD License (BSD). Please see [License File](LICENSE.md) for more information.


<a href="https://singularity.is"><img src="http://www.gravatar.com/avatar/8663d48ea6093d2ce917217ceeca1cc2.png"></a><br>
<i>#InventTomorrow</i><br>
<a href="https://www.singularity.is">www.singularity.is</a>