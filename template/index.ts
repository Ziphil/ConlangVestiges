//

import commonManager from "./common";
import fallbackManager from "./fallback";
import mainManager from "./main";
import topManager from "./top";


const managers = [
  commonManager,
  mainManager,
  topManager,
  fallbackManager
];

export default managers;