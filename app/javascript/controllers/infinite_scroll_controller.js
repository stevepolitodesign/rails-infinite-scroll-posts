import { Controller } from "stimulus"

export default class extends Controller {
    static targets = ["entry"]
    static values = {
        path: String,
    }

  connect() {
    this.createObserver();
  }

  createObserver() {
    let observer;
  
    let options = {
      threshold: 1
    };
    
    observer = new IntersectionObserver(entries => this.handleIntersect(entries), options);
    observer.observe(this.entryTarget);
  }

  handleIntersect(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // https://github.com/turbolinks/turbolinks/issues/219#issuecomment-376973429
        history.replaceState(history.state, "", this.pathValue);
      }
    });
  }
 
}
