import {buildInitialState} from './reducers/gui';
import {legacyConfig} from './legacy-config';

export {default} from './containers/gui.jsx';
export {default as GUIComponent} from './components/gui/gui.jsx';
export {default as AppStateHOC} from './lib/app-state-hoc.jsx';
export {setAppElement} from 'react-modal';
// 소비자가 codle 스토리지를 이 번들의 ScratchStorage로 구성하도록 재노출한다.
// gui/VM이 쓰는 것과 동일한 인스턴스라 Asset 정체성·워커가 일치한다.
export {ScratchStorage, Asset} from '@scratch/scratch-storage';

export {legacyConfig};
export const guiInitialState = buildInitialState(legacyConfig);

export * from './exported-reducers';
