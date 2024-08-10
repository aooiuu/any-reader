import { message } from 'ant-design-vue';
import { IS_MOBILE } from '@/constants';

message.config({
  top: IS_MOBILE ? document.body.clientHeight / 2 + 'px' : '40px',
  maxCount: 1,
  duration: 1
});
