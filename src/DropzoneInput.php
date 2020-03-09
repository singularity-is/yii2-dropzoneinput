<?php
/*
 * Nikola Radovic <info@singularity-solution.com>
 * Company: Singularity Solution <https://singularity-solution.com>
 *
 * For the full copyright and license information, please view
 * the LICENSE file that was distributed with this source code.
 */

namespace singularity\dropzoneinput;


use yii\helpers\ArrayHelper;
use yii\base\Model;
use yii\helpers\Html;
use yii\helpers\Inflector;
use yii\helpers\Json;
use yii\helpers\Url;
use yii\web\JsExpression;
use yii\widgets\ActiveField;
use yii\widgets\InputWidget;

/**
 * Class AttributeFieldRender
 * @package common\widgets
 *
 * @property ActiveField $field
 * @property Model $model
 * @property array $files
 * @property string $attribute
 * @property array $options
 * @property array $clientOptions
 * @property array $wrapperOptions
 * @property string $name
 * @property string $value
 * @property array $magnificPopupOptions
 */
class DropzoneInput extends InputWidget
{
    public $wrapperOptions = [];
    public $clientOptions = [];
    public $magnificPopupOptions = [];
    public $files = [];

    public function init()
    {
        $this->initOptions();
        $this->initClientOptions();

        parent::init();
    }

    /**
     * {@inheritdoc}
     */
    public function run()
    {
        $this->registerJs();
        return Html::tag('div', $this->getContent(), $this->options);
    }

    protected function registerJs()
    {
        $js = [];
        $view = $this->getView();
        DropzoneInputAssets::register($view);
        $rawOptions = ArrayHelper::merge($this->clientOptions, [
            'maxFiles' => 20,
            'imageUrl' => Url::to(['/image/view']),
            'dictRemoveFile' => '<i class="fa fa-times-circle"></i>',
            'dictCancelUpload' => '<i class="fa fa-times-circle"></i>',
            'previewTemplate' => $this->render('template')
        ]);
        $options = Json::encode($rawOptions);
        $input = Html::getInputId($this->model, $this->attribute);
        $config = Json::encode([
            'el' => "#{$this->getDropzoneId()}",
            'input' => "#{$input}",
            'files' => $this->files,
            'magnificPopupOptions' => $this->getMagnificPopupOptions()
        ]);
        $js[] = ";(function() {";
        $js[] = "dropzoneInput.initialize({$config}, {$options});";
        $js[] = "})();";

        $view->registerJs(implode("\n", $js));
    }

    protected function initClientOptions()
    {
        $defaults = [
            'url' => Url::to(['/file/upload']),
            'paramName' => 'UploadFileForm[files][]',
            'acceptedFiles' => 'image/*',
            'addRemoveLinks' => true,
            'uploadMultiple' => true,
        ];
        $this->clientOptions = ArrayHelper::merge($defaults, $this->clientOptions);
    }

    protected function initOptions()
    {
        $this->options['id'] = $this->getDropzoneId();
        Html::addCssClass($this->options, 'blackbox-dropzone');
    }

    protected function getDropzoneId()
    {
        return Inflector::variablize(ArrayHelper::getValue($this->options, 'id', "dropzone-input-{$this->getId()}"));
    }

    protected function getContent()
    {
        $input = Html::activeHiddenInput($this->model, $this->attribute, ['value' => '']);
        $message = 'Drag & Drop images or click to upload';
        $content = "<div class='dz-message'>
                    <i class='fal fa-upload mb-3 d-block'></i>
                    {$message}
                  </div>";

        return $input . PHP_EOL . $content;

    }

    private function getMagnificPopupOptions()
    {
        return ArrayHelper::merge([
            'type' => 'image',
            'items' => $this->files,
            'gallery' => [
                'enabled' => true
            ],
            'callbacks' => [
                'open' => new JsExpression("function() {
                    if (!$('.modal-open').hasClass('show-mfp')) {
                        setTimeout(function(){ 
                            $.magnificPopup.close(); 
                            $('.modal-open').addClass('show-mfp'); 
                        }, 1000);
                    }
                }")
            ]
        ], $this->magnificPopupOptions);
    }
}
