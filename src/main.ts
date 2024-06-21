import {web} from "./application/web";
import {logger} from "./application/logging";

web.listen(3000, () => {
    logger.info('Server started on http://localhost:3000')
});