<?php
/*
 * Nikola Radovic <info@singularity-solution.com>
 * Company: Singularity Solution <https://singularity-solution.com>
 *
 * For the full copyright and license information, please view
 * the LICENSE file that was distributed with this source code.
 */

namespace singularity\dropzoneinput;


use yii\web\AssetBundle;

class DropzoneInputAssets extends AssetBundle
{
    public $sourcePath = '@vendor/singularity/yii2-dropzoneinput/src/assets';

    public $css = [
        'css/dropzone-input.css'
    ];

    public $js = [
        'js/dropzone-input.js'
    ];

    public $depends = [
        'yii\web\JqueryAsset'
    ];
}