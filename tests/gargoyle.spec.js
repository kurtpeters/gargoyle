var gargoyle = require('../src/gargoyle.js').gargoyle,
    expect = require('expect.js');

describe('gargoyle', function() {

    'use strict';

    it('should return if feature is turned on', function() {

        expect(gargoyle.isEnabled('test')).to.be(false);

        gargoyle.set('test', true);
        expect(gargoyle.isEnabled('test')).to.be(true);
    });

    it('should return if feature is turned off with ! prefix', function() {

        expect(gargoyle.isEnabled('!test')).to.be(true);

        gargoyle.set('test', true);
        expect(gargoyle.isEnabled('!test')).to.be(false);
    });

    it('should set feature switches to internal registry', function() {

        expect(gargoyle.isEnabled('test')).to.be(false);

        gargoyle.set('test', true);
        expect(gargoyle.isEnabled('test')).to.be(true);

        expect(gargoyle.isEnabled('test:feature1')).to.be(false);

        gargoyle.set({
            'test': {
                'feature1': true
            }
        });
        expect(gargoyle.isEnabled('test:feature1')).to.be(true);

        expect(gargoyle.isEnabled('test')).to.be(true);
    });

    it('should restore feature registry', function() {

        gargoyle.set('test', true);
        expect(gargoyle.isEnabled('test')).to.be(true);

        gargoyle.restore();
        expect(gargoyle.isEnabled('test')).to.be(false);
    });

    it('should return gargoyle instance', function() {

        var test = gargoyle('feature');

        expect(test).not.to.be(void 0);

        expect(test).to.be.an(Object);
    });

    it('should set feature instance', function() {

        var test = gargoyle('feature');

        expect(test.isEnabled()).to.be(false);

        test.set(true);
        expect(test.isEnabled()).to.be(true);

        test.set(false);
        expect(test.isEnabled()).to.be(false);
    });

    it('should toggle feature instance', function() {

        var test = gargoyle('feature');

        expect(test.isEnabled()).to.be(false);

        test.toggle();
        expect(test.isEnabled()).to.be(true);

        test.toggle();
        expect(test.isEnabled()).to.be(false);
    });

    it('should trigger callback when provided condition is truthy', function() {

        var context = {"counter": 0}, feature;

        function callback() {
            this.counter++;
        }

        feature = gargoyle('test');
        feature.isEnabled(callback, context);
        expect(context.counter).to.equal(0);

        feature.toggle();
        feature.isEnabled(callback, context);
        expect(context.counter).to.equal(1);

        gargoyle.isEnabled('test', callback, context);
        expect(context.counter).to.equal(2);

        gargoyle.isEnabled('test:level2', callback, context);
        expect(context.counter).to.equal(2);

        gargoyle('test', callback, context);
        expect(context.counter).to.equal(3);
    });

    it('should combine multiple features into a single call', function() {
        var feature = gargoyle(['feature1', '!feature2', 'feature3']);
        expect(feature.isEnabled()).to.be(false);

        feature.set(true);
        expect(feature.isEnabled()).to.be(true);

        expect(gargoyle.isEnabled('feature1')).to.be(true);
        expect(gargoyle.isEnabled('feature2')).to.be(false);
        expect(gargoyle.isEnabled('feature3')).to.be(true);
    });

    afterEach(function() {
        gargoyle.restore();
    });

});
