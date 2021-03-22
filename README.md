# Rails Infinite Scrolling Posts

![demo](public/demo.gif)

## Outline

```ruby
# app/models/concerns/navigable.rb
module Navigable
  extend ActiveSupport::Concern

  def next
    self.class.where("id > ?", self.id).order(id: :asc).first
  end

  def previous
    self.class.where("id < ?", self.id).order(id: :desc).first
  end
end
```

```ruby
# app/models/post.rb
class Post < ApplicationRecord
  include Navigable
end
```

```ruby
# app/controllers/posts_controller.rb
class PostsController < ApplicationController
  ...
  def show
    @post = Post.find(params[:id])
    @next_post = @post.next
  end
  ...
end
```

```erb
<!-- app/views/posts/show.html.erb -->
<%= turbo_frame_tag dom_id(@post) do %>
  <div data-controller="infinite-scroll" data-infinite-scroll-path-value="<%= post_path(@post) %>" data-infinite-scroll-target="entry">
    <%= @post.title %>
    <%= @post.body %>
    <%= link_to 'Edit', edit_post_path(@post), data: { turbo_frame: "_top" } %> |
    <%= link_to 'Back', posts_path, data: { turbo_frame: "_top" }  %>
  </div>
  <%= turbo_frame_tag dom_id(@next_post), loading: :lazy, src: post_path(@next_post) do %>
    Loading...
  <% end if @next_post.present? %>
<% end %>
```

```javascript
// app/javascript/controllers/infinite_scroll_controller.js
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
      // https://github.com/w3c/IntersectionObserver/issues/124#issuecomment-476026505
      threshold: [0, 1.0]
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
```
