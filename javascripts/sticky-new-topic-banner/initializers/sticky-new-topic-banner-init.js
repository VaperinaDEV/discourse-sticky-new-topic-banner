import { apiInitializer } from "discourse/lib/api";
import { action } from "@ember/object";
import { popupAjaxError } from "discourse/lib/ajax-error";

export default apiInitializer("1.8.0", (api) => {
  
  api.modifyClass(
    "component:discovery/topics",
    (Superclass) =>
      class extends Superclass {
        @action
        async showInserted(event) {
          event?.preventDefault();
          
          if (this.args.model.loadingBefore) {
            return; // Already loading
          }
    
          const listControls = document.querySelector(".list-controls");
          listControls.scrollIntoView();
          
          const { topicTrackingState } = this;
          
          try {
            const topicIds = [...topicTrackingState.newIncoming];
            await this.args.model.loadBefore(topicIds, true);
            topicTrackingState.clearIncoming(topicIds);
          } catch (e) {
            popupAjaxError(e);
          }
        }
      }
  );
});
