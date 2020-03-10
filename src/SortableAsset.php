<?php

namespace singularity\dropzoneinput;


use yii\web\AssetBundle;

class SortableAsset extends AssetBundle
{
    public $sourcePath = '@bower/';

    public $css = [];

    public $js = [
        'jquery-sortable/source/js/jquery-sortable-min.js'
    ];
}
