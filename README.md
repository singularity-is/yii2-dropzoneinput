# Date Range Picker Widget for Yii2

[![Latest Version](https://img.shields.io/github/tag/singularity-is/yii2-dropzoneinput.svg?style=flat-square&label=release)](https://github.com/singularity-is/yii2-dropzoneinput/tags)
[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE.md)
[![Build Status](https://img.shields.io/travis/singularity/yii2-dropzoneinput/master.svg?style=flat-square)](https://travis-ci.org/singularity/yii2-dropzoneinput)
[![Coverage Status](https://img.shields.io/scrutinizer/coverage/g/singularity/yii2-dropzoneinput.svg?style=flat-square)](https://scrutinizer-ci.com/g/singularity/yii2-dropzoneinput/code-structure)
[![Quality Score](https://img.shields.io/scrutinizer/g/singularity/yii2-dropzoneinput.svg?style=flat-square)](https://scrutinizer-ci.com/g/singularity/yii2-dropzoneinput)
[![Total Downloads](https://img.shields.io/packagist/dt/singularity/yii2-dropzoneinput.svg?style=flat-square)](https://packagist.org/packages/singularity/yii2-dropzoneinput)

Renders a [Date Range Picker](http://www.dropzone.js) widget.

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

Using a model and widget configuration:

```
use singularity\dropzoneinput\Dropzoneinput;

...

<div class="col-lg-6">
    <div class="form-group">
        <?= $form->field($model, 'attribute')->widget(DropzoneInput::class); ?>
    </div>
</div>
```

```
use singularity\dropzoneinput\DropzoneInput;

...

<div class="col-lg-6">
    <?= DropzoneInput::widget([
        'model' => $model,
        'attribute' => 'attribute',
        'addonIcon' => 'fal fa-clock',
        'clientOptions' => [
            'opens' => 'right'
        ]
    ]); ?>
</div>
```

## Testing

```bash
$ ./vendor/bin/phpunit
```

## Contributing

Please see [CONTRIBUTING](CONTRIBUTING.md) for details.

## Credits

- [Nikola Radovic](https://github.com/dzona)
- [All Contributors](https://github.com/singularity-is/yii2-dropzoneinput/graphs/contributors)

## License

The BSD License (BSD). Please see [License File](LICENSE.md) for more information.


<a href="https://singularity.is"><img src="http://www.gravatar.com/avatar/8663d48ea6093d2ce917217ceeca1cc2.png"></a><br>
<i>#InventTomorrow</i><br>
<a href="https://www.singularity.is">www.singularity.is</a>