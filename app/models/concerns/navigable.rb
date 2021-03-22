module Navigable
    extend ActiveSupport::Concern

    def next
        self.class.where("id > ?", self.id).order(id: :asc).first
    end

    def previous
        self.class.where("id < ?", self.id).order(id: :desc).first
    end
end
