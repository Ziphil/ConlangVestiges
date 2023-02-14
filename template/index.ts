//

import fallbackManager from "./fallback";
import mainManager from "./main";
import topManager from "./top";


const managers = [
  mainManager,
  topManager,
  fallbackManager
];

export default managers;