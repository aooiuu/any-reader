import { PLATFORM } from '@/constants';
import router from './router';
import routerVSC from './router.vsc';

export default ['browser', 'electron'].includes(PLATFORM) ? router : routerVSC;
