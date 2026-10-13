import * as ScratchBlocks from 'scratch-blocks';
import getLlmReadySupplement from '../../../src/lib/get-llm-ready-supplement';

const target = (name, isStage, xml) => ({
    isOriginal: true,
    isStage,
    variables: {},
    comments: {},
    getName: () => name,
    blocks: {toXML: () => xml}
});

const vm = targets => ({
    runtime: {
        targets,
        getTargetForStage: () => targets.find(item => item.isStage)
    },
    getLocale: () => 'en'
});

beforeEach(() => ScratchBlocks.ScratchMsgs.setLocale('en'));

test('serializes nested statements with Blockly 12 without changing the live workspace', () => {
    const stage = target('Stage', true, '');
    const sprite = target('Cat', false, `<block type="control_repeat" id="repeat"><value name="TIMES"><shadow type="math_whole_number"><field name="NUM">2</field></shadow></value><statement name="SUBSTACK"><block type="motion_movesteps" id="move"><value name="STEPS"><shadow type="math_number"><field name="NUM">10</field></shadow></value></block></statement></block>`);
    const workspace = new ScratchBlocks.Workspace();
    const workspaceIds = ScratchBlocks.Workspace.getAll().map(item => item.id);
    try {
        const result = getLlmReadySupplement(vm([stage, sprite]), ScratchBlocks);
        expect(result.targets[0]).toEqual({index: 0, name: 'Stage', isStage: true, threads: []});
        expect(result.targets[1]).toMatchObject({index: 1, name: 'Cat', isStage: false});
        expect(result.targets[1].threads).toEqual([{
            firstBlockId: 'repeat',
            llmReadyCode: expect.stringMatching(/repeat 2[\s\S]*SUBSTACK \{[\s\S]*move 10 steps/)
        }]);
        expect(ScratchBlocks.Workspace.getAll().map(item => item.id)).toEqual(workspaceIds);
    } finally {
        workspace.dispose();
    }
});

test('disposes the temporary workspace after invalid block data', () => {
    const workspaceIds = ScratchBlocks.Workspace.getAll().map(item => item.id);
    expect(() => getLlmReadySupplement(vm([target('Stage', true, '<block type="missing_block"/>')]), ScratchBlocks)).toThrow();
    expect(ScratchBlocks.Workspace.getAll().map(item => item.id)).toEqual(workspaceIds);
});
