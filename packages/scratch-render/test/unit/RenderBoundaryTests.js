const test = require('tap').test;

const RenderWebGL = require('tap').mockRequire('../../src/RenderWebGL', {
    '../../src/TextBubbleSkin': require('../fixtures/MockSkin')
});

const boundary = opaque => RenderWebGL.prototype._getConvexHullPointsForDrawable.call({
    _allDrawables: [{
        skin: {size: [2, 2], isTouchingLinear: () => opaque},
        getVisible: () => true,
        updateCPURenderAttributes: () => {},
        getUniforms: () => ({}),
        enabledEffects: 0
    }]
}, 0);

test('transparent drawables have no boundary points', t => {
    t.same(boundary(false), []);
    t.end();
});

test('opaque drawables retain all four boundary corners', t => {
    const points = new Set(boundary(true).map(point => point.join(',')));
    t.same(points, new Set(['0,0', '0,1', '1,1', '1,0']));
    t.end();
});
