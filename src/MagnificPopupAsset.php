<?php

namespace singularity\dropzoneinput;


use yii\web\AssetBundle;

class MagnificPopupAsset extends AssetBundle
{
    public $sourcePath = '@bower/';

    public $js = [
        'magnific-popup/dist/jquery.magnific-popup.js',
        'slick-carousel/slick/slick.min.js'
    ];

    public $css = [
        'magnific-popup/dist/magnific-popup.css'
    ];

    public $depends = [
        'yii\web\JqueryAsset'
    ];
}
