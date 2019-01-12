/*
 * bootstrap-tagrules v0.0.1
 * 
 */

(function ($) {
    "use strict";
  
    var defaultOptions = {
      triggerChange: true,
      ifCondition: function(rule){
        return rule.ifCondition;
      },
      thenResponse: function(rule){
        return rule.thenResponse;
      }
    };
  
    /**
     * Constructor function
     */
    function RulesInput(ruleData, options) {
      this.isInit = true;
      this.rulesArray = [];
      this.isInit = false;
      self.options = $.extend({}, defaultOptions, options);
    }
  
    RulesInput.prototype = {
      constructor: RulesInput,
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
       * Refreshes the tags so they match the text/value of their corresponding
       * rule.
       */
      refresh: function() {
        var self = this;
      },
  
      /**
       * Returns the rules added as tags
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
      }
    }
   
    /**
     * Register JQuery plugin
     */
    $.fn.tagsrules = function(arg1, arg2, arg3) {
      var results = [];
  
      this.each(function() {
        var tagsrules = $(this).data('tagsrules');
        // Initialize a new tags input
        if (!tagsrules) {
            tagsrules = new tagsrules(this, arg1);
            $(this).data('tagsrules', tagsrules);
            results.push(tagsrules);
  
            if (this.tagName === 'SELECT') {
                $('option', $(this)).attr('selected', 'selected');
            }
  
            // Init tags from $(this).val()
            $(this).val($(this).val());
        } else if (!arg1 && !arg2) {
            // tagsrules already exists
            // no function, trying to init
            results.push(tagsrules);
        } else if(tagsrules[arg1] !== undefined) {
            // Invoke function on existing tags input
              if(tagsrules[arg1].length === 3 && arg3 !== undefined){
                 var retVal = tagsrules[arg1](arg2, null, arg3);
              }else{
                 var retVal = tagsrules[arg1](arg2);
              }
            if (retVal !== undefined)
                results.push(retVal);
        }
      });
  
      if ( typeof arg1 == 'string') {
        // Return the results from the invoked function calls
        return results.length > 1 ? results : results[0];
      } else {
        return results;
      }
    }
  
    $.fn.tagsrules.Constructor = tagsrules;
  
    /**
     * Initialize tagsrules behaviour on inputs and selects which have
     * data-role=tagsrules
     */
    $(function() {
      $("input[data-role=tagsrules], select[multiple][data-role=tagsrules]").tagsrules();
    });
  })(window.jQuery);
  
  function tagsrulesLoad(element, rules) {
    var elt = $(element);
    elt.tagsrules({
        tagClass: function(rule) {
          return rule.classlist;
        },
        ruleValue: 'value',
        ruleText: 'text'
    });
    for(var i=0; i<rules.length; i++) {
      var rule = rules[i];
      elt.tagsrules('add', rule);
    }
  }
  
  function tagsrulesDistinctWithCount(rules, prop) {
    var returnArray = [];
    for(var i=0; i<rules.length; i++) {
      var thisrule = rules[i];
      var foundIndex = -1;
      for(var j=0; j<returnArray.length; j++) {
        var rtag = returnArray[j];
        if(thisrule[prop]===rtag[prop]) {
          foundIndex = j;
          break;
        }
      }
      if(foundIndex>-1) {
        returnArray[foundIndex].count++;
      } else {
        var newrule = $.extend({}, thisrule, {"count" : 1});
        returnArray.push( newrule );
      }
    }
    return returnArray;
  }
  