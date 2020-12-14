import { __assign, __extends, __spreadArrays } from "tslib";
import PDFPage from "../PDFPage";
import PDFFont from "../PDFFont";
import { normalizeAppearance, defaultButtonAppearanceProvider, } from "./appearances";
import PDFField, { assertFieldAppearanceOptions, } from "./PDFField";
import { rgb } from "../colors";
import { degrees, adjustDimsForRotation, reduceRotation, } from "../rotations";
import { drawImage, rotateInPlace } from "../operations";
import { PDFStream, PDFAcroPushButton, } from "../../core";
import { assertIs, assertOrUndefined, addRandomSuffix } from "../../utils";
/**
 * Represents a button field of a [[PDFForm]].
 *
 * [[PDFButton]] fields are interactive controls that users can click with their
 * mouse. This type of [[PDFField]] is not stateful. The purpose of a button
 * is to perform an action when the user clicks on it, such as opening a print
 * modal or resetting the form. Buttons are typically rectangular in shape and
 * have a text label describing the action that they perform when clicked.
 */
var PDFButton = /** @class */ (function (_super) {
    __extends(PDFButton, _super);
    function PDFButton(acroPushButton, ref, doc) {
        var _this = _super.call(this, acroPushButton, ref, doc) || this;
        assertIs(acroPushButton, 'acroButton', [
            [PDFAcroPushButton, 'PDFAcroPushButton'],
        ]);
        _this.acroField = acroPushButton;
        return _this;
    }
    // NOTE: This doesn't handle image borders.
    // NOTE: Acrobat seems to resize the image (maybe even skewing its aspect
    //       ratio) to fit perfectly within the widget's rectangle. This method
    //       does not currently do that. Should there be an option for that?
    /**
     * Display an image inside the bounds of this button's widgets. For example:
     * ```js
     * const pngImage = await pdfDoc.embedPng(...)
     * const button = form.getButton('some.button.field')
     * button.setImage(pngImage)
     * ```
     * This will update the appearances streams for each of this button's widgets.
     * @param image The image that should be displayed.
     */
    PDFButton.prototype.setImage = function (image) {
        var _a;
        var _b;
        // Create appearance stream with image, ignoring caption property
        var context = this.acroField.dict.context;
        var widgets = this.acroField.getWidgets();
        for (var idx = 0, len = widgets.length; idx < len; idx++) {
            var widget = widgets[idx];
            ////////////
            var rectangle = widget.getRectangle();
            var ap = widget.getAppearanceCharacteristics();
            var bs = widget.getBorderStyle();
            var borderWidth = (_b = bs === null || bs === void 0 ? void 0 : bs.getWidth()) !== null && _b !== void 0 ? _b : 1;
            var rotation = reduceRotation(ap === null || ap === void 0 ? void 0 : ap.getRotation());
            var rotate = rotateInPlace(__assign(__assign({}, rectangle), { rotation: rotation }));
            var adj = adjustDimsForRotation(rectangle, rotation);
            var imageDims = image.scaleToFit(adj.width - borderWidth * 2, adj.height - borderWidth * 2);
            var drawingArea = {
                x: 0 + borderWidth,
                y: 0 + borderWidth,
                width: adj.width - borderWidth * 2,
                height: adj.height - borderWidth * 2,
            };
            // Support borders on images and maybe other properties
            var options = {
                x: drawingArea.x + (drawingArea.width / 2 - imageDims.width / 2),
                y: drawingArea.y + (drawingArea.height / 2 - imageDims.height / 2),
                width: imageDims.width,
                height: imageDims.height,
                //
                rotate: degrees(0),
                xSkew: degrees(0),
                ySkew: degrees(0),
            };
            var imageName = addRandomSuffix('Image', 10);
            var appearance = __spreadArrays(rotate, drawImage(imageName, options));
            ////////////
            var Resources = { XObject: (_a = {}, _a[imageName] = image.ref, _a) };
            var stream = context.formXObject(appearance, {
                Resources: Resources,
                BBox: context.obj([0, 0, rectangle.width, rectangle.height]),
                Matrix: context.obj([1, 0, 0, 1, 0, 0]),
            });
            var streamRef = context.register(stream);
            this.updateWidgetAppearances(widget, { normal: streamRef });
        }
        this.markAsClean();
    };
    /**
     * Show this button on the specified page with the given text. For example:
     * ```js
     * const ubuntuFont = await pdfDoc.embedFont(ubuntuFontBytes)
     * const page = pdfDoc.addPage()
     *
     * const form = pdfDoc.getForm()
     * const button = form.createButton('some.button.field')
     *
     * button.addToPage('Do Stuff', page, {
     *   x: 50,
     *   y: 75,
     *   width: 200,
     *   height: 100,
     *   textColor: rgb(1, 0, 0),
     *   backgroundColor: rgb(0, 1, 0),
     *   borderColor: rgb(0, 0, 1),
     *   borderWidth: 2,
     *   rotate: degrees(90),
     *   font: ubuntuFont,
     * })
     * ```
     * This will create a new widget for this button field.
     * @param text The text to be displayed for this button widget.
     * @param page The page to which this button widget should be added.
     * @param options The options to be used when adding this button widget.
     */
    PDFButton.prototype.addToPage = function (
    // TODO: This needs to be optional, e.g. for image buttons
    text, page, options) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        assertOrUndefined(text, 'text', ['string']);
        assertOrUndefined(page, 'page', [[PDFPage, 'PDFPage']]);
        assertFieldAppearanceOptions(options);
        // Create a widget for this button
        var widget = this.createWidget({
            x: ((_a = options === null || options === void 0 ? void 0 : options.x) !== null && _a !== void 0 ? _a : 0) - ((_b = options === null || options === void 0 ? void 0 : options.borderWidth) !== null && _b !== void 0 ? _b : 0) / 2,
            y: ((_c = options === null || options === void 0 ? void 0 : options.y) !== null && _c !== void 0 ? _c : 0) - ((_d = options === null || options === void 0 ? void 0 : options.borderWidth) !== null && _d !== void 0 ? _d : 0) / 2,
            width: (_e = options === null || options === void 0 ? void 0 : options.width) !== null && _e !== void 0 ? _e : 100,
            height: (_f = options === null || options === void 0 ? void 0 : options.height) !== null && _f !== void 0 ? _f : 50,
            textColor: (_g = options === null || options === void 0 ? void 0 : options.textColor) !== null && _g !== void 0 ? _g : rgb(0, 0, 0),
            backgroundColor: (_h = options === null || options === void 0 ? void 0 : options.backgroundColor) !== null && _h !== void 0 ? _h : rgb(0.75, 0.75, 0.75),
            borderColor: options === null || options === void 0 ? void 0 : options.borderColor,
            borderWidth: (_j = options === null || options === void 0 ? void 0 : options.borderWidth) !== null && _j !== void 0 ? _j : 0,
            rotate: (_k = options === null || options === void 0 ? void 0 : options.rotate) !== null && _k !== void 0 ? _k : degrees(0),
            caption: text,
        });
        var widgetRef = this.doc.context.register(widget.dict);
        // Add widget to this field
        this.acroField.addWidget(widgetRef);
        // Set appearance streams for widget
        var font = (_l = options === null || options === void 0 ? void 0 : options.font) !== null && _l !== void 0 ? _l : this.doc.getForm().getDefaultFont();
        this.updateWidgetAppearance(widget, font);
        // Add widget to the given page
        page.node.addAnnot(widgetRef);
    };
    /**
     * Returns `true` if this button has been marked as dirty, or if any of this
     * button's widgets do not have an appearance stream. For example:
     * ```js
     * const button = form.getButton('some.button.field')
     * if (button.needsAppearancesUpdate()) console.log('Needs update')
     * ```
     * @returns Whether or not this button needs an appearance update.
     */
    PDFButton.prototype.needsAppearancesUpdate = function () {
        var _a;
        if (this.isDirty())
            return true;
        var widgets = this.acroField.getWidgets();
        for (var idx = 0, len = widgets.length; idx < len; idx++) {
            var widget = widgets[idx];
            var hasAppearances = ((_a = widget.getAppearances()) === null || _a === void 0 ? void 0 : _a.normal) instanceof PDFStream;
            if (!hasAppearances)
                return true;
        }
        return false;
    };
    /**
     * Update the appearance streams for each of this button's widgets using
     * the default appearance provider for buttons. For example:
     * ```js
     * const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)
     * const button = form.getButton('some.button.field')
     * button.defaultUpdateAppearances(helvetica)
     * ```
     * @param font The font to be used for creating the appearance streams.
     */
    PDFButton.prototype.defaultUpdateAppearances = function (font) {
        assertIs(font, 'font', [[PDFFont, 'PDFFont']]);
        this.updateAppearances(font);
    };
    /**
     * Update the appearance streams for each of this button's widgets using
     * the given appearance provider. If no `provider` is passed, the default
     * appearance provider for buttons will be used. For example:
     * ```js
     * const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)
     * const button = form.getButton('some.button.field')
     * button.updateAppearances(helvetica, (field, widget, font) => {
     *   ...
     *   return {
     *     normal: drawButton(...),
     *     down: drawButton(...),
     *   }
     * })
     * ```
     * @param font The font to be used for creating the appearance streams.
     * @param provider Optionally, the appearance provider to be used for
     *                 generating the contents of the appearance streams.
     */
    PDFButton.prototype.updateAppearances = function (font, provider) {
        assertIs(font, 'font', [[PDFFont, 'PDFFont']]);
        assertOrUndefined(provider, 'provider', [Function]);
        var widgets = this.acroField.getWidgets();
        for (var idx = 0, len = widgets.length; idx < len; idx++) {
            var widget = widgets[idx];
            this.updateWidgetAppearance(widget, font, provider);
        }
    };
    PDFButton.prototype.updateWidgetAppearance = function (widget, font, provider) {
        var apProvider = provider !== null && provider !== void 0 ? provider : defaultButtonAppearanceProvider;
        var appearances = normalizeAppearance(apProvider(this, widget, font));
        this.updateWidgetAppearanceWithFont(widget, font, appearances);
    };
    /**
     * > **NOTE:** You probably don't want to call this method directly. Instead,
     * > consider using the [[PDFForm.getButton]] method, which will create an
     * > instance of [[PDFButton]] for you.
     *
     * Create an instance of [[PDFButton]] from an existing acroPushButton and ref
     *
     * @param acroPushButton The underlying `PDFAcroPushButton` for this button.
     * @param ref The unique reference for this button.
     * @param doc The document to which this button will belong.
     */
    PDFButton.of = function (acroPushButton, ref, doc) { return new PDFButton(acroPushButton, ref, doc); };
    return PDFButton;
}(PDFField));
export default PDFButton;
//# sourceMappingURL=PDFButton.js.map