<?php

namespace singularity\dropzoneinput;


use yii\web\AssetBundle;

class SortableAsset extends AssetBundle
{
    public $sourcePath = '@npm/';

    public $css = [];

    public $js = [
        'jquery-ui-sortable-npm/jquery-ui-sortable.min.js'
    ];

    public $depends = [
        'yii\web\YiiAsset',
    ];
}
