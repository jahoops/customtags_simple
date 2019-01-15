/*
 * bootstrap-ticketrules v0.0.1
 * 
 */

(function ($) {
    "use strict";

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
        // var ifCondition = self.options.ifCondition(rule),
        // thenResponse = self.options.thenResponse(rule);
        self.rulesArray.push( rule);
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
        
      },
      ruleBuilder: function(el) {
        var self = this;
        var forminfo = {
          ifArray : [
            { if:"ticket number",is:["{number}"] },
            { if:"due date",is:["past due","tomorrow","in {number} days","past due {number} days"] },
            { if:"category",is:["DVD", "Mouse", "Notebook"] } 
          ],
          thenArray : [
            { then:"add tag {text}",to: ["ticket"] },
            { then:"show notification {text}", to:["me","my team lead","other"] },
            { then:"email {text}", to:["me","my team lead","other"] },
            { then:"text {text}", to:["me","my team lead","other"] }
          ]
        };
        var ifSelect = [];
        ifSelect.push('<label class="col-1" for="ifArray">if</label><select class="form-control input-sm mx-1 col-5" id="ifArray">');
        ifSelect.push('<option value=""></option>');
        for (var i = 0; i < forminfo.ifArray.length; i++) {
          var ifItem = forminfo.ifArray[i].if;
          ifSelect.push('<option value="'+ifItem+'">'+ifItem+'</option>');
        }
        ifSelect.push('</select>');

        var isSelect = [];
        isSelect.push('<label class="col-1" for="isArray">is</label><select class="form-control input-sm mx-1 col" id="isArray">');
        isSelect.push('<option value=""></option>');
        isSelect.push('</select>');

        var thenSelect = [];
        thenSelect.push('<label class="col-1" for="thenArray">then</label><select class="form-control input-sm mx-1 col-5" id="thenArray">');
        thenSelect.push('<option value=""></option>');
        for (var i = 0; i < forminfo.thenArray.length; i++) {
          var thenItem = forminfo.thenArray[i].then;
          thenSelect.push('<option value="'+thenItem+'">'+thenItem+'</option>');
        }
        thenSelect.push('</select>');

        var toSelect = [];
        toSelect.push('<label class="col-1" for="toArray">to</label><select class="form-control input-sm mx-1 col" id="toArray">');
        toSelect.push('<option value=""></option>');
        toSelect.push('</select>');

        el.html('<form class="form-inline m-4 col-12" style="height:1px"><div class="form-row m-1 w-100">' + ifSelect.join('') +  isSelect.join('') + '</div><div class="form-row m-1 w-100">' + thenSelect.join('') + toSelect.join('') +'</div></form><form class="form-inline m-4 col-12" id="constructRule" style="height:1px">...waiting</form> <a href="#" class="form-control w-50 btn btn-sm btn-success mx-auto" id="execRuleBtn">Execute Rule on ticket list</a>');
        var ifAry = el.find('#ifArray');
        var isAry = el.find('#isArray');
        var thenAry = el.find('#thenArray');
        var toAry = el.find('#toArray');
        var execBtn = el.find('#execRuleBtn');
        ifAry.on('change', function(){
          isAry.empty();
          isSelect = [];
          isSelect.push('<option value=""></option>');
          for (var i = 0; i < forminfo.ifArray.length; i++) {
            var ifItem = forminfo.ifArray[i];
            if(ifItem.if === $(this).val()){
              for (var j = 0; j < ifItem.is.length; j++) {
                var isItem = ifItem.is[j];
                isSelect.push('<option value="'+isItem+'">'+isItem+'</option>');
              }
            }
          }
          isAry.html(isSelect.join(''));
          constructRule();
        });
        isAry.on('change', function(){
          constructRule();
        });
        thenAry.on('change', function(){
          toAry.empty();
          toSelect = [];
          toSelect.push('<option value=""></option>');
          for (var i = 0; i < forminfo.thenArray.length; i++) {
            var thenItem = forminfo.thenArray[i];
            if(thenItem.then === $(this).val()){
              for (var j = 0; j < thenItem.to.length; j++) {
                var toItem = thenItem.to[j];
                toSelect.push('<option value="'+toItem+'">'+toItem+'</option>');
              }
            }
          }
          toAry.html(toSelect.join(''));
          constructRule();
        });
        toAry.on('change', function(){
          constructRule();
        });
        execBtn.on('click',function(){
          var ifVal = $(this).closest('#ruleside').find('#ifArray').val();
          var isVal = $(this).closest('#ruleside').find('#isArray').val();
          var thenVal = $(this).closest('#ruleside').find('#thenArray').val();
          var toVal = $(this).closest('#ruleside').find('#toArray').val();
          var ifInput =  $('#ifInput').val() || '';
          var isInput = $('#isInput').val() || '';
          var thenInput =  $('#thenInput').val() || '';
          var toInput = $('#toInput').val() || '';
          if(!ifVal || !isVal || !thenVal || !toVal) return;
          var r = {if:{val:ifVal,input:ifInput},is:{val:isVal,input:isInput},then:{val:thenVal,input:thenInput},to:{val:toVal,input:toInput}};
          self.rulesArray.push(r);

          $('#tagsmain #ticketlist td').each(function(){
            var condition = false;
            if(r.if.val==='ticket number') {
              var _is = r.is.input || r.is.val;
              if($(this).attr('tagticket')==_is) {
                condition = true;
              }
            }
            if(r.if.val==='due date') {
              if($(this).attr('tagdue')==r.is.val) {
                condition = true;
              }
            }
            if(r.if.val==='category') {
              if($(this).attr('tagcat')==r.is.val) {
                condition = true;
              }
            }
            if(condition) {
              if(r.then.val==='add tag {text}') {
                var tag = { ticket:$(this).siblings('[tagticket]').attr('tagticket'),text:r.then.input,value:0 };
                var __tag = $(this).siblings('.__tag').find('div.bootstrap-tagsinput');
                if(__tag.length<1) {
                  __tag = $(this).siblings('.__tag').find('div');
                  __tag.tagsinput({
                    tagClass: function(x) {
                      return x.classlist;
                    },
                    itemValue: 'value',
                    itemText: 'text'
                  });
                }
                __tag.tagsinput('add', tag.text);
              }
              if(thenVal==='show notification {text}') {
                PNotify.success({
                  title: 'From Rules',
                  text: r.then.input
                });
              }              
            }
          });
          var el = $('#tagsmain #taglist').empty();
          var taglistAry = [];
          $('#ticketlist .bootstrap-tagsinput span.badge').each(function(){
            var newtag = { text:$(this).text(),class:this.classList.toString() };
            var addflag = true;
            for (var i = 0; i < taglistAry.length; i++) {
              var tag = taglistAry[i];
              if(tag.text===newtag.text) {
                addflag = false;
                break;
              }
            }
            if(addflag) {
              taglistAry.push(newtag);
            }
          });
          var taglistHTML = [];
          for (var i = 0; i < taglistAry.length; i++) {
            var tag = taglistAry[i];
            taglistHTML.push('<badge style="color:white;cursor:pointer;" class="btn m-1 taglistbtn ' + tag.class + '" tagtext="' + tag.text + '">'+tag.text+'</badge>');
          }
          el.html(taglistHTML.join(''));
          $(el).find('.taglistbtn').on('click', function(){
            $(this).toggleClass('tagSelected');
            var filter = [];
            $(this).parent().find('.tagSelected').each(function(){
              filter.push($(this).text());
            });
            $('#ticketlist tbody tr').hide();
            $('#ticketlist tbody span.badge').each(function(){
              if(filter.indexOf($(this).text())>-1){
                $(this).closest('tr').show();
              }
            });
            if(filter.length<1) {
              $('#ticketlist tbody tr').show();
            }
          });
        });
        function constructRule() {
          var cr = el.find('#constructRule');
          if(!cr) return;
          var ifVal = el.find('#ifArray').val();
          var isVal = el.find('#isArray').val();
          var thenVal = el.find('#thenArray').val();
          var toVal = el.find('#toArray').val();
          var span = '<span class="m-1">';
          var crContent = [];
          if(ifVal) {
            var x = ifVal.indexOf('{text}');
            if(x<0) {
              x = ifVal.indexOf('{number}');
            }
            if(x>-1) {
              crContent.push(span + 'if ' + ifVal.slice(0,x) + ' </span><input class="form-control input-sm" id="ifInput"></input>');
            } else {
              crContent.push(span + 'if ' + ifVal + ' </span>');
            }
          }
          if(isVal) {
            var x = isVal.indexOf('{text}');
            if(x<0) {
              x = isVal.indexOf('{number}');
            }
            if(x>-1) {
              crContent.push(span + 'is ' + isVal.slice(0,x) + ' </span><input class="form-control input-sm" id="isInput"></input>');
            } else {
              crContent.push(span + 'is ' + isVal + ' </span>');
            }
          }
          if(thenVal) {
            var x = thenVal.indexOf('{text}');
            if(x<0) {
              x = thenVal.indexOf('{number}');
            }
            if(x>-1) {
              crContent.push(span + 'then ' + thenVal.slice(0,x) + ' </span><input class="form-control input-sm" id="thenInput"></input>');
            } else {
              crContent.push(span + 'then ' + thenVal + ' </span>');
            }
          }
          if(toVal) {
            var x = toVal.indexOf('{text}');
            if(x<0) {
              x = toVal.indexOf('{number}');
            }
            if(x>-1) {
              crContent.push(span + 'to ' + toVal.slice(0,x) + ' </span><input class="form-control input-sm" id="toInput"></input>');
            } else {
              crContent.push(span + 'to ' + toVal + ' </span>');
            }
          }
          cr.html(crContent.join(''));
        }
      }
    };
   
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
  
