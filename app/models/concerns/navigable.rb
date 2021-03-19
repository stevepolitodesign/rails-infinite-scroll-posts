module Navigable
    extend ActiveSupport::Concern

    def next
        self.class.where("id > ?", self.id).order(id: :asc).limit(1).first
    end

    def previous
        self.class.where("id < ?", self.id).order(id: :desc).limit(1).first
    end
end