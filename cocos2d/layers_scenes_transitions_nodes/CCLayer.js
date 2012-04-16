/****************************************************************************
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011      Zynga Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var cc = cc = cc || {};


//
// cc.Layer
//
/** @brief cc.Layer is a subclass of cc.Node that implements the TouchEventsDelegate protocol.

 All features from cc.Node are valid, plus the following new features:
 - It can receive iPhone Touches
 - It can receive Accelerometer input
 */

cc.Layer = cc.Node.extend({
    _m_bIsTouchEnabled:false,
    _m_bIsAccelerometerEnabled:false,
    _m_bIsKeypadEnabled:false,

    init:function () {
        var bRet = false;
        do
        {
            var pDirector = new cc.Director();
            if (!(pDirector = cc.Director.sharedDirector())) {
                break;
            }
            this.setContentSize(pDirector.getWinSize());
            this._m_bIsTouchEnabled = false;
            this._m_bIsAccelerometerEnabled = false;
            // success
            bRet = true;
        } while (0);
        return bRet;
    },

    /// Touch and Accelerometer related
    /** If isTouchEnabled, this method is called onEnter. Override it to change the
     way CCLayer receives touch events.
     ( Default: CCTouchDispatcher.sharedDispatcher().addStandardDelegate(this,0); )
     Example:
     CCLayer.registerWithTouchDispatcher()
     {
     CCTouchDispatcher.sharedDispatcher().addTargetedDelegate(this,INT_MIN+1,true);
     }
     @since v0.8.0
     */
    registerWithTouchDispatcher:function () {
        cc.TouchDispatcher.sharedDispatcher().addStandardDelegate(this, 0);
    },

    /** whether or not it will receive Touch events.
     You can enable / disable touch events with this property.
     Only the touches of this node will be affected. This "method" is not propagated to it's children.
     @since v0.8.1
     */
    /// isTouchEnabled getter
    getIsTouchEnabled:function () {
        return this._m_bIsTouchEnabled;
    },
    /// isTouchEnabled setter
    setIsTouchEnabled:function (enabled) {
        if (this._m_bIsTouchEnabled != enabled) {
            this._m_bIsTouchEnabled = enabled;


            if (this._m_bIsRunning) {
                if (enabled) {
                    this.registerWithTouchDispatcher();
                } else {
                    // have problems?
                    cc.TouchDispatcher.sharedDispatcher().removeDelegate(this);
                }
            }
        }
    },
    /** whether or not it will receive Accelerometer events
     You can enable / disable accelerometer events with this property.
     @since v0.8.1
     */
    /// isAccelerometerEnabled getter
    getIsAccelerometerEnabled:function () {
        return this._m_bIsAccelerometerEnabled;
    },
    /// isAccelerometerEnabled setter
    setIsAccelerometerEnabled:function (enabled) {
        if (enabled != this._m_bIsAccelerometerEnabled) {
            this._m_bIsAccelerometerEnabled = enabled;

            if (this._m_bIsRunning) {
                if (enabled) {
                    cc.Accelerometer.sharedAccelerometer().setDelegate(this);
                }
                else {
                    cc.Accelerometer.sharedAccelerometer().setDelegate(null);
                }
            }
        }
    },
    /** whether or not it will receive keypad events
     You can enable / disable accelerometer events with this property.
     it's new in cocos2d-x
     */
    /// isKeypadEnabled getter
    getIsKeypadEnabled:function () {
        return this._m_bIsKeypadEnabled;
    },
    /// isKeypadEnabled setter
    setIsKeypadEnabled:function (enabled) {
        if (enabled != this._m_bIsKeypadEnabled) {
            this._m_bIsKeypadEnabled = enabled;
            if (this._m_bIsRunning) {
                if (enabled) {
                    cc.KeypadDispatcher.sharedDispatcher().addDelegate(this);
                } else {
                    cc.KeypadDispatcher.sharedDispatcher().removeDelegate(this);
                }
            }
        }
    },

/// Callbacks
    onEnter:function () {
        // register 'parent' nodes first
        // since events are propagated in reverse order
        if (this._m_bIsTouchEnabled) {
            this.registerWithTouchDispatcher();
        }

        // then iterate over all the children
        //cc.Node.onEnter();
        this._super();

        // add this layer to concern the Accelerometer Sensor
        if (this._m_bIsAccelerometerEnabled) {
            cc.Accelerometer.sharedAccelerometer().setDelegate(this);
        }

        // add this layer to concern the kaypad msg
        if (this._m_bIsKeypadEnabled) {
            cc.KeypadDispatcher.sharedDispatcher().addDelegate(this);
        }
    },
    onExit:function () {
        if (this._m_bIsTouchEnabled) {
            cc.TouchDispatcher.sharedDispatcher().removeDelegate(this);
        }

        // remove this layer from the delegates who concern Accelerometer Sensor
        if (this._m_bIsAccelerometerEnabled) {
            cc.Accelerometer.sharedAccelerometer().setDelegate(null);
        }

        // remove this layer from the delegates who concern the kaypad msg
        if (this._m_bIsKeypadEnabled) {
            cc.KeypadDispatcher.sharedDispatcher().removeDelegate(this);
        }

        this._super();
    },
    onEnterTransitionDidFinish:function () {
        if (this._m_bIsAccelerometerEnabled) {
            cc.Accelerometer.sharedAccelerometer().setDelegate(this);
        }
        this._super();
    },
    // default implements are used to call script callback if exist
    ccTouchBegan:function (pTouch, pEvent) {
        cc.Assert(false, "Layer#ccTouchBegan override me");
        return true;
    },
    ccTouchMoved:function (pTouch, pEvent) {
    },
    ccTouchEnded:function (pTouch, pEvent) {
    },
    ccTouchCancelled:function (pTouch, pEvent) {
    },

    // default implements are used to call script callback if exist
    ccTouchesBegan:function (pTouch, pEvent) {
    },
    ccTouchesMoved:function (pTouch, pEvent) {
    },
    ccTouchesEnded:function (pTouch, pEvent) {
    },
    ccTouchesCancelled:function (pTouch, pEvent) {
    },

    didAccelerate:function (pAccelerationValue) {
    },

    addLayer:function (layer) {
        cc.Assert(this.m_pLayers, "cc.Layer addLayer");
        this.m_pLayers.addObject(layer);
    }
});

cc.Layer.node = function () {
    var pRet = new cc.Layer();
    if (pRet && pRet.init()) {
        return pRet;
    }
    else {
        return null;
    }
};


//
// CCLayerColor
//
/** @brief CCLayerColor is a subclass of CCLayer that implements the CCRGBAProtocol protocol.

 All features from CCLayer are valid, plus the following new features:
 - opacity
 - RGB colors
 */
cc.LayerColor = cc.Layer.extend({
    _m_pSquareVertices:[new cc.Vertex2F(0, 0), new cc.Vertex2F(0, 0), new cc.Vertex2F(0, 0), new cc.Vertex2F(0, 0)],
    _m_pSquareColors:[cc.ccc4(0, 0, 0, 1), cc.ccc4(0, 0, 0, 1), cc.ccc4(0, 0, 0, 1), cc.ccc4(0, 0, 0, 1)],
    _m_cOpacity:0,
    _m_tColor:cc.BLACK,
    _m_tBlendFunc:new cc.BlendFunc(cc.BLEND_SRC, cc.BLEND_DST),

    /// ColorLayer
    ctor:function () {
        this.setAnchorPoint(cc.ccp(0, 1));
        this._m_bIsRelativeAnchorPoint = false;
    },

    // Opacity and RGB color protocol
    /// opacity getter
    getOpacity:function () {
        return this._m_cOpacity;
    },
    /// opacity setter
    setOpacity:function (Var) {
        this._m_cOpacity = Var;
        this._updateColor();
    },
    /// color getter
    getColor:function () {
        return this._m_tColor;
    },
    /// color setter
    setColor:function (Var) {
        this._m_tColor = Var;
        this._updateColor();
    },
    /// blendFunc getter
    getBlendFunc:function () {
        return this._m_tBlendFunc;
    },
    /// blendFunc setter
    setBlendFunc:function (Var) {
        this._m_tBlendFunc = Var;
    },

    initWithColor:function (color) {
        var s = cc.Director.sharedDirector().getWinSize();
        this.initWithColorWidthHeight(color, s.width, s.height);
        return true;
    },

    initWithColorWidthHeight:function (color, width, height) {
        this._m_tBlendFunc.src = cc.BLEND_SRC;
        this._m_tBlendFunc.dst = cc.BLEND_DST;

        this._m_tColor = new cc.Color3B(color.r, color.g, color.b);
        this._m_cOpacity = color.a;

        for (var i = 0; i < this._m_pSquareVertices.length; i++) {
            this._m_pSquareVertices[i].x = 0.0;
            this._m_pSquareVertices[i].y = 0.0;
        }

        this._updateColor();
        this.setContentSize(cc.SizeMake(width, height));
        return true;
    },
    /// override contentSize
    setContentSize:function (size) {
        this._m_pSquareVertices[1].x = size.width * cc.CONTENT_SCALE_FACTOR();
        this._m_pSquareVertices[2].y = size.height * cc.CONTENT_SCALE_FACTOR();
        this._m_pSquareVertices[3].x = size.width * cc.CONTENT_SCALE_FACTOR();
        this._m_pSquareVertices[3].y = size.height * cc.CONTENT_SCALE_FACTOR();

        this._super(size);
    },
    /** change width and height in Points
     @since v0.8
     */
    changeWidthAndHeight:function (w, h) {
        this.setContentSize(cc.SizeMake(w, h));
    },
    /** change width in Points*/
    changeWidth:function (w) {
        this.setContentSize(cc.SizeMake(w, this._m_tContentSize.height));
    },
    /** change height in Points*/
    changeHeight:function (h) {
        this.setContentSize(cc.SizeMake(this._m_tContentSize.width, h));
    },
    _updateColor:function () {
        for (var i = 0; i < 4; i++) {
            this._m_pSquareColors[i].r = this._m_tColor.r;
            this._m_pSquareColors[i].g = this._m_tColor.g;
            this._m_pSquareColors[i].b = this._m_tColor.b;
            this._m_pSquareColors[i].a = this._m_cOpacity;
        }
    },
    setIsOpacityModifyRGB:function (bValue) {
    },
    getIsOpacityModifyRGB:function () {
        return false;
    },

    draw:function () {
        //TODO
        //TODO need to fix child position in relation to parent
        if (cc.renderContextType == cc.kCanvas) {
            cc.renderContext.save();
            if (this.getOpacity() != 255) {
                cc.renderContext.globalAlpha = this.getOpacity() / 255;
            }
            var rapx = this.getPositionX();
            var rapy = this.getPositionY();

            cc.renderContext.translate(rapx, -rapy);
            if (this.getRotation() != 0) {
                cc.renderContext.rotate(cc.DEGREES_TO_RADIANS(this.getRotation()));
            }

            cc.renderContext.transform(this.getScaleX(),
                Math.tan(cc.DEGREES_TO_RADIANS(-this._m_fSkewY)),
                Math.tan(cc.DEGREES_TO_RADIANS(-this._m_fSkewX)),
                this.getScaleY(),
                0,
                0);

            var lpx = 0 - this.getContentSize().width * this.getAnchorPoint().x;
            var lpy = 0 - this.getContentSize().height * this.getAnchorPoint().y;
            var tWidth = this.getContentSize().width;
            var tHeight = this.getContentSize().height;

            cc.renderContext.fillStyle = "rgba(" + this._m_tColor.r + "," + this._m_tColor.g + "," + this._m_tColor.b + ",255)";
            cc.renderContext.fillRect(0 - this.getContentSize().width * this.getAnchorPoint().x, 0 - this.getContentSize().height * this.getAnchorPoint().y,
                this.getContentSize().width, this.getContentSize().height);
            cc.renderContext.restore();
            return;
        }
        this._super();
        // Default GL states: GL_TEXTURE_2D, GL_VERTEX_ARRAY, GL_COLOR_ARRAY, GL_TEXTURE_COORD_ARRAY
        // Needed states: GL_VERTEX_ARRAY, GL_COLOR_ARRAY
        // Unneeded states: GL_TEXTURE_2D, GL_TEXTURE_COORD_ARRAY

        // glDisableClientState(GL_TEXTURE_COORD_ARRAY);

        // glDisable(GL_TEXTURE_2D);

        // glVertexPointer(2, GL_FLOAT, 0, this._m_pSquareVertices);

        // glColorPointer(4, GL_UNSIGNED_BYTE, 0, this._m_pSquareColors);

        var newBlend = false;
        if (this._m_tBlendFunc.src != cc.BLEND_SRC || this._m_tBlendFunc.dst != cc.BLEND_DST) {
            newBlend = true;
            //glBlendFunc(this._m_tBlendFunc.src, this._m_tBlendFunc.dst);
        }
        else if (this._m_cOpacity != 255) {
            newBlend = true;
            // glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);
        }

        // glDrawArrays(GL_TRIANGLE_STRIP, 0, 4);

        if (newBlend) {
            // glBlendFunc(cc.BLEND_SRC, cc.BLEND_DST);
        }
        // restore default GL state
        // glEnableClientState(GL_TEXTURE_COORD_ARRAY);
        // glEnable(GL_TEXTURE_2D);
    }
});

/** creates a CCLayer with color, width and height in Points */
cc.LayerColor.layerWithColorWidthHeight = function (color, width, height) {
    var pLayer = new cc.LayerColor();
    if (pLayer && pLayer.initWithColorWidthHeight(color, width, height)) {
        return pLayer;
    }
    return null;
};

/** creates a CCLayer with color. Width and height are the window size. */
cc.LayerColor.layerWithColor = function (color) {
    var pLayer = new cc.LayerColor();
    if (pLayer && pLayer.initWithColor(color)) {
        return pLayer;
    }
    return null;
};

cc.LayerColor.node = function () {
    var pRet = new cc.LayerColor();
    if (pRet && pRet.init()) {
        return pRet;
    }
    return null;
};

//
// CCLayerGradient
//
/** CCLayerGradient is a subclass of CCLayerColor that draws gradients across
 the background.

 All features from CCLayerColor are valid, plus the following new features:
 - direction
 - final color
 - interpolation mode

 Color is interpolated between the startColor and endColor along the given
 vector (starting at the origin, ending at the terminus).  If no vector is
 supplied, it defaults to (0, -1) -- a fade from top to bottom.

 If 'compressedInterpolation' is disabled, you will not see either the start or end color for
 non-cardinal vectors; a smooth gradient implying both end points will be still
 be drawn, however.

 If ' compressedInterpolation' is enabled (default mode) you will see both the start and end colors of the gradient.

 @since v0.99.5
 */
cc.LayerGradient = cc.LayerColor.extend({
    _m_startColor:null,
    _m_endColor:null,
    _m_cStartOpacity:null,
    _m_cEndOpacity:null,
    _m_AlongVector:null,
    _m_bCompressedInterpolation:null,
    getStartColor:function () {
        return this._m_tColor;
    },
    setStartColor:function (color) {
        this.setColor(color);
    },
    setEndColor:function (color) {
        this._m_endColor = color;
        this._updateColor();
    },
    getEndColor:function () {
        return this._m_endColor;
    },
    setStartOpacity:function (o) {
        this._m_cStartOpacity = o;
        this._updateColor();
    },
    getStartOpacity:function () {
        return this._m_cStartOpacity;
    },
    setEndOpacity:function (o) {
        this._m_cEndOpacity = o;
        this._updateColor();
    },
    getEndOpacity:function () {
        return this._m_cEndOpacity;
    },
    setVector:function (Var) {
        this.m_AlongVector = Var;
        this._updateColor();
    },
    getVector:function () {
        return this.m_AlongVector;
    },
    getIsCompressedInterpolation:function () {
        return this._m_bCompressedInterpolation;
    },
    setIsCompressedInterpolation:function (compress) {
        this._m_bCompressedInterpolation = compress;
        this._updateColor();
    },
    initWithColor:function (start, end, v) {
        var argnum = arguments.length;
        switch (argnum) {
            case 2:
                /** Initializes the CCLayer with a gradient between start and end. */
                return this.initWithColor(start, end, cc.ccp(0, -1));
                break;
            case 3:
                /** Initializes the CCLayer with a gradient between start and end in the direction of v. */
                this._m_endColor.r = end.r;
                this._m_endColor.g = end.g;
                this._m_endColor.b = end.b;

                this._m_cEndOpacity = end.a;
                this._m_cStartOpacity = start.a;
                this.m_AlongVector = v;

                this._m_bCompressedInterpolation = true;

                return cc.LayerColor.initWithColor(cc.cs4(start.r, start.g, start.b, 255));
                break;
            default:
                throw "Argument must be non-nil ";
                break;
        }

    },
    _updateColor:function () {
        cc.LayerColor._updateColor();

        var h = cc.ccpLength(this.m_AlongVector);
        if (h == 0)
            return;

        var c = Math.sqrt(2.0);
        var u = new cc.Point();
        u = cc.ccp(this.m_AlongVector.x / h, this.m_AlongVector.y / h);

        // Compressed Interpolation mode
        if (this._m_bCompressedInterpolation) {
            var h2 = 1 / ( Math.floor(u.x) + Math.floor(u.y) );
            u = cc.ccpMult(u, h2 * c);
        }

        var opacityf = this._m_cOpacity / 255.0;

        var S = [ this._m_tColor.r, this._m_tColor.g, this._m_tColor.b, this._m_cStartOpacity * opacityf];

        var E = [ this._m_endColor.r, this._m_endColor.g, this._m_endColor.b, this._m_cEndOpacity * opacityf]

        // (-1, -1)
        this._m_pSquareColors[0].r = (E.r + (S.r - E.r) * ((c + u.x + u.y) / (2.0 * c)));
        this._m_pSquareColors[0].g = (E.g + (S.g - E.g) * ((c + u.x + u.y) / (2.0 * c)));
        this._m_pSquareColors[0].b = (E.b + (S.b - E.b) * ((c + u.x + u.y) / (2.0 * c)));
        this._m_pSquareColors[0].a = (E.a + (S.a - E.a) * ((c + u.x + u.y) / (2.0 * c)));
        // (1, -1)
        this._m_pSquareColors[1].r = (E.r + (S.r - E.r) * ((c - u.x + u.y) / (2.0 * c)));
        this._m_pSquareColors[1].g = (E.g + (S.g - E.g) * ((c - u.x + u.y) / (2.0 * c)));
        this._m_pSquareColors[1].b = (E.b + (S.b - E.b) * ((c - u.x + u.y) / (2.0 * c)));
        this._m_pSquareColors[1].a = (E.a + (S.a - E.a) * ((c - u.x + u.y) / (2.0 * c)));
        // (-1, 1)
        this._m_pSquareColors[2].r = (E.r + (S.r - E.r) * ((c + u.x - u.y) / (2.0 * c)));
        this._m_pSquareColors[2].g = (E.g + (S.g - E.g) * ((c + u.x - u.y) / (2.0 * c)));
        this._m_pSquareColors[2].b = (E.b + (S.b - E.b) * ((c + u.x - u.y) / (2.0 * c)));
        this._m_pSquareColors[2].a = (E.a + (S.a - E.a) * ((c + u.x - u.y) / (2.0 * c)));
        // (1, 1)
        this._m_pSquareColors[3].r = (E.r + (S.r - E.r) * ((c - u.x - u.y) / (2.0 * c)));
        this._m_pSquareColors[3].g = (E.g + (S.g - E.g) * ((c - u.x - u.y) / (2.0 * c)));
        this._m_pSquareColors[3].b = (E.b + (S.b - E.b) * ((c - u.x - u.y) / (2.0 * c)));
        this._m_pSquareColors[3].a = (E.a + (S.a - E.a) * ((c - u.x - u.y) / (2.0 * c)));
    }
});


// cc.LayerGradient
//
cc.LayerGradient.layerWithColor = function (start, end, v) {
    var argnum = arguments.length;
    var pLayer = new cc.LayerGradient();
    switch (argnum) {
        case 2:
            /** Creates a full-screen CCLayer with a gradient between start and end. */
            if (pLayer && pLayer.initWithColor(start, end)) {
                return pLayer;
            }
            return null;
            break;
        case 3:
            /** Creates a full-screen CCLayer with a gradient between start and end in the direction of v. */
            if (pLayer && pLayer.initWithColor(start, end, v)) {
                return pLayer;
            }
            return null;
            break;
        default:
            throw "Argument must be non-nil ";
            break;
    }
};
cc.LayerGradient.node = function () {
    var pRet = new cc.LayerGradient();
    if (pRet && pRet.init()) {
        return pRet;
    }
    else {
        delete pRet;
        pRet = null;
        return null;
    }
};

/** @brief CCMultipleLayer is a CCLayer with the ability to multiplex it's children.
 Features:
 - It supports one or more children
 - Only one children will be active a time
 */
/// MultiplexLayer
cc.LayerMultiplex = cc.Layer.extend({
    m_nEnabledLayer:0,
    m_pLayers:null,
    initWithLayer:function (layer) {
        this.m_pLayers = [];
        this.m_pLayers.addObject(layer);
        this.m_nEnabledLayer = 0;
        this.addChild(layer);
        return true;
    },
    initWithLayers:function () {
        this.m_pLayers = arguments;
        this.m_nEnabledLayer = 0;
        this.addChild(this.m_pLayers[this.m_nEnabledLayer]);
        return true;
    },
    /** switches to a certain layer indexed by n.
     * The current (old) layer will be removed from it's parent with 'cleanup:YES'.
     */
    switchTo:function (n) {
        cc.Assert(n < this.m_pLayers.count(), "Invalid index in MultiplexLayer switchTo message");

        this.removeChild(this.m_pLayers.getObjectAtIndex(this.m_nEnabledLayer), true);

        this.m_nEnabledLayer = n;

        this.addChild(this.m_pLayers.getObjectAtIndex(n));
    },
    /** release the current layer and switches to another layer indexed by n.
     The current (old) layer will be removed from it's parent with 'cleanup:YES'.
     */
    switchToAndReleaseMe:function (n) {
        cc.Assert(n < this.m_pLayers.count(), "Invalid index in MultiplexLayer switchTo message");

        this.removeChild(this.m_pLayers.getObjectAtIndex(this.m_nEnabledLayer), true);

        //[layers replaceObjectAtIndex:enabledLayer withObject:[NSNull null]];
        this.m_pLayers.replaceObjectAtIndex(this.m_nEnabledLayer, null);

        this.m_nEnabledLayer = n;

        this.addChild(this.m_pLayers.getObjectAtIndex(n));
    }
});
/** creates a CCLayerMultiplex with one or more layers using a variable argument list. */
cc.LayerMultiplex.layerWithLayers = function (/*Multiple Arguments*/) {
    var pMultiplexLayer = new cc.LayerMultiplex();
    if (pMultiplexLayer.initWithLayers(arguments)) {
        return pMultiplexLayer;
    }
    return null;
};
/**
 * lua script can not init with undetermined number of variables
 * so add these functinons to be used with lua.
 */
cc.LayerMultiplex.layerWithLayer = function (layer) {
    var pMultiplexLayer = new cc.LayerMultiplex();
    pMultiplexLayer.initWithLayer(layer);
    return pMultiplexLayer;
};
cc.LayerMultiplex.node = function () {
    var pRet = new cc.LayerMultiplex();
    if (pRet && pRet.init()) {
        return pRet;
    }
    else {
        delete pRet;
        pRet = null;
        return null;
    }
};