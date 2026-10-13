const test = require('tap').test;
const RoborisenG3 = require('../../src/extensions/roborisen_g3');

test('G Cube 3 motor command resolves and clears its busy state', async t => {
    const extension = new RoborisenG3({});
    let commands = 0;
    extension.enqueue = () => {
        commands++;
    };
    const result = extension.robotFunctionToggle('ant', 0);
    t.type(result, Promise);
    t.equal(extension.inActionCube, true);
    t.equal(commands, 1);
    await result;
    t.equal(extension.inActionCube, false);
    t.equal(extension.robotFunctionState, true);
});
