/*
 * bootstrap-ticketrules v0.0.1
 * 
 */

(function ($) {
    "use strict";

    var ifArray = [
      { if:"due date",is:["past due","tomorrow","in {number} days","past due {number} days"] },
      { if:"category",is:["DVD", "monitor", "notebook"] } 
    ];
    var thenArray = [
      { then:"add tag {text}",to: ["ticket"] },
      { then:"show notification {text}", to:["me","my team lead","other {user}"] },
      { then:"email {text}", to:["me","my team lead","other {user}"] },
      { then:"text {text}", to:["me","my team lead","other {user}"] }
    ];

    var defaultOptions = {
      triggerChange: true,
      showRulesInConsole: function(){
        console.log("current rules:", ruleArray);
      }
    };
  
    /**
     * Constructor function
     */
    function TicketRules(ruleData, options) {
      this.isInit = true;
      this.rulesArray = ruleData;
      this.options = $.extend({}, defaultOptions, options);
      this.isInit = false;
      
    }
  
    TicketRules.prototype = {
      constructor: TicketRules,
        /**
        * Adds the given rule
        */
      add: function(rule, options) {
        var self = this;
        var ifCondition = self.options.ifCondition(rule),
        thenResponse = self.options.thenResponse(rule)
        self.rulesArray.push( {"ifCondition":ifCondition(rule),"thenResponse":thenResponse(rule) });
      },
  
      /**
       * Removes the given rule. Pass true to dontPushVal to prevent updating the
       * elements val()
       */
      remove: function(rule, options) {
        var self = this;
  
        self.$element.trigger($.Event('ruleRemoved',  { rule: rule, options: options }));
      },
  
      /**
       * Removes all rules
       */
      removeAll: function() {
        var self = this;
  
        while(self.rulesArray.length > 0)
          self.rulesArray.pop();
  
        self.pushVal(self.options.triggerChange);
      },
  
      /**
       * Refreshes the ticket so they match the text/value of their corresponding
       * rule.
       */
      refresh: function() {
        var self = this;
      },
  
      /**
       * Returns the rules added as ticket
       */
      rules: function() {
        return this.rulesArray;
      },
  
      /**
       * Assembly value by retrieving the value of each rule, and set it on the
       * element.
       */
      pushVal: function() {
        var self = this,
            val = $.map(self.rules(), function(rule) {
              return self.options.ruleValue(rule).toString();
            });
  
        self.$element.val( val.join(self.options.delimiter) );
  
        if (self.options.triggerChange)
          self.$element.trigger('change');
      },

      runRules: function(tickets) {
        if(!ticket || !$.isArray(tickets)) return;
        
      }
    }
   
    /**
     * Register JQuery plugin
     */
    $.fn.ticketrules = function(arg1, arg2) {
      if (!ticketrules) {
          var ticketrules = new TicketRules(arg1, arg2);
      }
      return ticketrules;
    }
  
    $.fn.ticketrules.Constructor = TicketRules;

  })(window.jQuery);
  
