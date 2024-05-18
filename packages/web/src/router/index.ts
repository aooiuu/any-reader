import { PLATFORM } from '@/constants';
import router from './router';
import routerVSC from './router.vsc';

export default PLATFORM === 'browser' ? router : routerVSC;
