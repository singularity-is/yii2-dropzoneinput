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
use yii\web\View;
use yii\widgets\ActiveField;
use yii\widgets\InputWidget;

/**
 * Class DropzoneInput
 *
 * @property ActiveField $field
 * @property Model $model
 * @property array $files
 * @property string $attribute
 * @property array $options
 * @property array $clientOptions
 * @property string $name
 * @property string $value
 * @property array $magnificPopupOptions
 * @property array $cropperOptions
 * @property bool $highlightFirst
 * @property bool $enableRotate
 * @property bool $enablePreview
 * @property bool $enableSort
 * @property bool $enableCrop
 * @property string $beforeCrop
 */
class DropzoneInput extends InputWidget
{
    public $clientOptions = [];
    public $magnificPopupOptions = [];
    public $cropperOptions = [];
    public $files = [];

    public $removeMessage = 'Are you sure you want to delete image?';

    public $highlightFirst = false;
    public $enableRotate = false;
    public $enablePreview = false;
    public $enableSort = true;
    public $enableCrop = false;

    public $beforeCrop = null;

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
        $dictCoverFile = array_key_exists('dictCoverFile', $this->clientOptions) ? $this->clientOptions['dictCoverFile'] : 'Cover Image';

        $this->registerOptionalAssets($view);
        DropzoneInputAssets::register($view);

        $rawOptions = ArrayHelper::merge([
            'maxFiles' => 20,
            'imageUrl' => Url::to(['/image/view']),
            'rotateUrl' => Url::to(['/image/rotate']),
            'dictRemoveFile' => '<i class="fa fa-times-circle"></i>',
            'dictCancelUpload' => '<i class="fa fa-times-circle"></i>',
            'previewTemplate' => $this->render('template', ['enableRotate' => $this->enableRotate, 'dictCoverFile' => $dictCoverFile])
        ], $this->clientOptions);
        $options = Json::encode($rawOptions);
        $input = Html::getInputId($this->model, $this->attribute);
        $config = Json::encode([
            'el' => "#{$this->getDropzoneId()}",
            'input' => "#{$input}",
            'files' => $this->files,
            'removeMessage' => $this->removeMessage,
            'enableRotate' => $this->enableRotate,
            'enablePreview' => $this->enablePreview,
            'enableSort' => $this->enableSort,
            'enableCrop' => $this->enableCrop,
            'beforeCrop' => $this->beforeCrop,
            'magnificPopupOptions' => $this->getMagnificPopupOptions(),
            'cropperOptions' => $this->getCropperOptions()
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
        $class = "dropzone-input-wrapper" . ($this->highlightFirst ? ' highlight-first' : '');
        Html::addCssClass($this->options, $class);
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
                    if (!$('body').hasClass('show-mfp')) {
                        setTimeout(function(){ 
                            $.magnificPopup.close(); 
                            $('body').addClass('show-mfp'); 
                        }, 1000);
                    }
                }")
            ]
        ], $this->magnificPopupOptions);
    }

    private function getCropperOptions()
    {
        return ArrayHelper::merge([
            'aspectRatio' => 1
        ], $this->cropperOptions);
    }

    protected function registerOptionalAssets(View $view)
    {
        if ($this->enablePreview) {
            MagnificPopupAsset::register($view);
        }

        if ($this->enableSort) {
            SortableAsset::register($view);
        }

        if ($this->enableCrop) {
            CropperAsset::register($view);
        }
    }
}
