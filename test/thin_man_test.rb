require 'test_helper'

class ThinManTest < ActionView::TestCase
  include ThinMan::AjaxHelper

  def setup
    @html_options = {class: 'test_class'}
    @target = '#target_element'
    @error_target = '#error_target'
    @insert_method = 'append'
    @empty_on_success = '#empty_me'
    @http_method = 'PATCH'
    @no_mouse_click = true
    @progress_target = '#progress_element'
    @progress_color = 'blue'
    @scroll_to = true
    @sequence_group = 'test_group'
    @sequence_number = 0

    @replace_response = true
    @no_confirm = true
    @custom_progress = '#custom_progress'
  end

  it "generates ajax link hash" do
    test_link = ajax_link('test link', "http://test.com", @html_options, @target, 
        insert_method: @insert_method, empty_on_success: @empty_on_success,
        http_method: @http_method, no_mouse_click: @no_mouse_click,
        progress_target: @progress_target, progress_color: @progress_color,
        scroll_to: @scroll_to)
    test_link.must_match "data-ajax-link="
    test_link.must_match(/class=.test_class./)
    test_link.must_match "data-ajax-target=\"#{@target}\""
    test_link.must_match "data-insert-method=\"#{@insert_method}\""
    test_link.must_match "data-empty-on-success=\"#{@empty_on_success}\""
    test_link.must_match "data-ajax-method=\"#{@http_method}\""
    test_link.must_match "data-no-mouse-click=\"#{@no_mouse_click}\""
    test_link.must_match "data-progress-target=\"#{@progress_target}\""
    test_link.must_match "data-progress-color=\"#{@progress_color}\""
    test_link.must_match "data-scroll-to=\"#{@scroll_to}\""
  end

  it "generates an instant link" do
    test_link = ajax_link_now('test link', "http://test.com", @html_options, @target,
        insert_method: @insert_method, empty_on_success: @empty_on_success,
        http_method: @http_method, progress_target: @progress_target,
        progress_color: @progress_color, sequence_number: @sequence_number,
        sequence_group: @sequence_group)
    test_link.must_match "data-ajax-link-now="
    test_link.must_match(/class=.test_class./)
    test_link.must_match "data-ajax-target=\"#{@target}\""
    test_link.must_match "data-insert-method=\"#{@insert_method}\""
    test_link.must_match "data-empty-on-success=\"#{@empty_on_success}\""
    test_link.must_match "data-ajax-method=\"#{@http_method}\""
    test_link.must_match "data-progress-target=\"#{@progress_target}\""
    test_link.must_match "data-progress-color=\"#{@progress_color}\""
    test_link.must_match "data-sequence-group=\"#{@sequence_group}\""
    test_link.must_match "data-sequence-number=\"#{@sequence_number}\""
  end

  it "generates a delete link" do
    test_link = ajax_delete('test link', "http://test.com", @html_options, @target, replace_response: @replace_response, no_confirm: @no_confirm, custom_progress: @custom_progress,  no_mouse_click: @no_mouse_click)
    test_link.must_match "data-ajax-delete="
    test_link.must_match(/class=.test_class./)
    test_link.must_match "data-ajax-target=\"#{@target}\""
    test_link.must_match "data-replace-response=\"#{@replace_response}\""
    test_link.must_match "data-no-confirm=\"#{@no_confirm}\""
    test_link.must_match "data-custom-progress=\"#{@custom_progress}\""
    test_link.must_match "data-no-mouse-click=\"#{@no_mouse_click}\""
  end

  it "generates ajax form hash" do
    form_hash = ajax_form_hash(@target, error_target: @error_target, insert_method: @insert_method, empty_on_success: @empty_on_success, no_mouse_click: @no_mouse_click, progress_target: @progress_target, progress_color: @progress_color)
    form_hash['data-ajax-form'].must_equal true
    form_hash['data-ajax-target'].must_equal @target
    form_hash['data-error-target'].must_equal @error_target
    form_hash['data-insert-method'].must_equal @insert_method
    form_hash['data-empty-on-success'].must_equal @empty_on_success
    form_hash['data-no-mouse-click'].must_equal @no_mouse_click
    form_hash['data-progress-target'].must_equal @progress_target
    form_hash['data-progress-color'].must_equal @progress_color
  end

end
