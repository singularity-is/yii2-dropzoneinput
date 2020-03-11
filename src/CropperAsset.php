<?php
/**
 * Dositej Grbovic <info@singularity.is>
 * Company: Singularity <https://singularity.is>
 */

namespace singularity\dropzoneinput;


use yii\web\AssetBundle;

class CropperAsset extends AssetBundle
{
    public $sourcePath = '@npm/';

    public $css = [
        'cropperjs/dist/cropper.min.css'
    ];

    public $js = [
        'cropperjs/dist/cropper.min.js'
    ];

    public $depends = [
        'yii\web\YiiAsset',
    ];
}