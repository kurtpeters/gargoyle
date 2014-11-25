(function(root) {

    'use strict';

    var featureRegistry = {},
        gargoyleRegistry = {},
        gargoyle;

    function extendRegistry(features, prefix) {

        var item, feature;

        for (item in features) {

            feature = features[item];

            if (prefix !== void 0) {
                item = prefix + ':' + item;
            }

            if (feature instanceof Object) {
                extendRegistry(feature, item);
                continue;
            }

            featureRegistry[item] = feature;
        }
    }

    function Gargoyle(options) {
        this.feature = options.feature;
        return this;
    }

    Gargoyle.prototype.isEnabled = function(callback, context) {
        var features = this.feature.split(','),
            index = features.length,
            feature;

        while (index--) {

            feature = features[index];

            if (~feature.indexOf('!')) {

                if (featureRegistry[features[index].replace('!', '')]) {
                    return false;
                }

                continue;
            }

            if (!featureRegistry[feature]) {
                return false;
            }
        }

        if (callback instanceof Function) {
            callback.call(context || this);
        }

        return true;
    };

    Gargoyle.prototype.set = function(value) {
        var features = this.feature.split(','),
            index = features.length,
            feature;

        while (index--) {

            feature = features[index];

            if (~feature.indexOf('!')) {
                featureRegistry[feature.replace('!', '')] = !value;
                continue;
            }

            featureRegistry[feature] = value;
        }

        return this;
    };

    Gargoyle.prototype.toggle = function() {
        var features = this.feature.split(','),
            index = features.length,
            feature;

        while (index--) {

            feature = features[index].replace('!', '');
            featureRegistry[feature] = !featureRegistry[feature];
        }

        return this;
    };

    root.gargoyle = gargoyle = function(feature, callback, context) {

        feature = feature.toString();

        if (gargoyleRegistry[feature]) {

            feature = gargoyleRegistry[feature];

            if (callback !== void 0) {
                feature.isEnabled(callback, context);
            }

            return feature;
        }

        feature = gargoyleRegistry[feature] = new Gargoyle({
            "feature": feature
        });

        if (callback !== void 0) {
            feature.isEnabled(callback, context);
        }

        return feature;

    };

    gargoyle.isEnabled = function(feature) {
        var agrs = Array.prototype.slice.call(arguments, 1);
        return Gargoyle.prototype.isEnabled.apply({
            "feature": feature
        }, agrs);
    };

    gargoyle.set = function(feature, value) {

        var features = {};

        if (feature && feature.constructor === String) {
            features[feature] = value;
        } else {
            features = feature || features;
        }

        extendRegistry(features);

        return this;

    };

    gargoyle.restore = function() {
        featureRegistry = {};
        return this;
    };

})(this);
