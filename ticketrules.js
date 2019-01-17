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
  
    var newRule = {};

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
        if(!ticket || !$.isSelectAry(tickets)) return;
        
      },
      ruleBuilder: function(el) {
        var self = this;
        var ruleInput = buildLabel('ruleInput','Title:','col-1 mb-4') + buildInput('ruleInput','col-11 mb-4');
        var formInfo = {
          ifSelectAry : [
            { if:"ticket number",is:["{number}"] },
            { if:"due date",is:["past due","tomorrow","in {number} days","past due {number} days"] },
            { if:"category",is:["DVD", "Mouse", "Notebook"] } 
          ],
          thenSelectAry : [
            { then:"add tag {text}",to: ["ticket"] },
            { then:"show notification {text}", to:["me","my team lead","other"] },
            { then:"email {text}", to:["me","my team lead","other"] },
            { then:"text {text}", to:["me","my team lead","other"] }
          ]
        };
        var ifSelect =  buildLabel('ifSelectEl','if') + buildSelect('ifSelectEl', formInfo.ifSelectAry.map(function(x){ return x.if; }));
        var isSelect =  buildLabel('isSelectEl','is') + buildSelect('isSelectEl', []);
        var thenSelect = buildLabel('thenSelectEl','then') + buildSelect('thenSelectEl', formInfo.thenSelectAry.map(function(x){ return x.then; }));
        var toSelect = buildLabel('toSelectEl','to') + buildSelect('toSelectEl', []);
        var formStart = '<div class="col-12"><div class="form-row m-1 w-100 text-center">';
        var formMid = '</div><div class="form-row m-1 w-100 text-center">';
        var formEnd = '</div></div><div class="form-row m-1 w-100 text-center" id="constructRule"><span class="m-auto">...waiting<span></div> <a href="#" class="form-control w-50 btn btn-sm btn-success mx-auto" id="execRuleBtn">Execute Rule on ticket list</a>';
        el.html(formStart + ruleInput + ifSelect +  isSelect + formMid + thenSelect + toSelect + formEnd);
        var ifSelectEl = el.find('#ifSelectEl');
        var isSelectEl = el.find('#isSelectEl');
        var thenSelectEl = el.find('#thenSelectEl');
        var toSelectEl = el.find('#toSelectEl');
        var execBtnEl = el.find('#execRuleBtn');
        ifSelectEl.on('change', function(){
          isSelectEl.empty();
          var isOptions = [];
          isOptions.push('<option value=""></option>');
          for (var i = 0; i < formInfo.ifSelectAry.length; i++) {
            var ifItem = formInfo.ifSelectAry[i];
            if(ifItem.if === $(this).val()){
              for (var j = 0; j < ifItem.is.length; j++) {
                var isItem = ifItem.is[j];
                isOptions.push('<option value="'+isItem+'">'+isItem+'</option>');
              }
            }
          }
          isSelectEl.html(isOptions.join(''));
          constructRule();
        });
        isSelectEl.on('change', function(){
          constructRule();
        });
        thenSelectEl.on('change', function(){
          toSelectEl.empty();
          var toOptions = [];
          toOptions.push('<option value=""></option>');
          for (var i = 0; i < formInfo.thenSelectAry.length; i++) {
            var thenItem = formInfo.thenSelectAry[i];
            if(thenItem.then === $(this).val()){
              for (var j = 0; j < thenItem.to.length; j++) {
                var toItem = thenItem.to[j];
                toOptions.push('<option value="'+toItem+'">'+toItem+'</option>');
              }
            }
          }
          toSelectEl.html(toOptions.join(''));
          constructRule();
        });
        toSelectEl.on('change', function(){
          constructRule();
        });
        execBtnEl.on('click',function(){
          var ruleInput = $('#ruleInput').val() || '';
          newRule.title = ruleInput;
          var iter = ['if', 'is', 'then', 'to'];
          for (var i = 0; i < iter.length; i++) {
            var it = iter[i];
            for (var j = 0; j < newRule[it].length; j++) {
              var r = newRule[it][j];
              if(r.key) {
                r.value = $('#' + it + 'Input' + r.key).val();
              }
              
            }            
          }

          var r = $.extend({},newRule);
          self.rulesArray.push(r);

          console.log(r); 

          $('#tagsmain #ticketlist td').each(function(){
            var condition = false;
            if(r.if[0].value ==='ticket number') {
              if($(this).attr('tagticket')==r.is[0].value) {
                condition = true;
              }
            }
            if(r.if[0].value ==='due date') {
              if($(this).attr('tagdue')==r.is[0].value) {
                condition = true;
              }
            }
            if(r.if[0].value ==='category') {
              if($(this).attr('tagcat')==r.is[0].value) {
                condition = true;
              }
            }
            if(condition) {
              var thenVal = r.then[0].value.trim();
              if(thenVal === 'add tag' && r.then.length===2) {
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
                __tag.tagsinput('add', r.then[1].value);
              }
              if(thenVal === 'show notification') {
                PNotify.success({
                  title: 'From ' + r.title,
                  text: r.then[1].value
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
        function getTokenBuilder(tokenString) {
          var tokenBuilder = [];
          var from = 0;
          var pos = tokenString.indexOf('{',from);
          while(pos > -1) {
            var pos2 = tokenString.indexOf('}',pos);
            if(pos2 > -1) {
              var token = tokenString.slice(pos+1,pos2);
              var _seg = 'segment' + from;
              tokenBuilder.push({ key: false, value: tokenString.slice(from, pos) });
              tokenBuilder.push({ key: tokenString.slice(pos+1,pos2),value: '' });
              from = pos2 + 1;
              pos = from < tokenString.length - 1 ? tokenString.indexOf('{',from) : -1;
            } else {
              from = pos;
              break;
            }
          }
          var last = from < tokenString.length - 1 ? tokenString.slice(from).trim() : false;
          if(last) {
            tokenBuilder.push({ key: false, value: tokenString.slice(from) });
          }
          return tokenBuilder;
        }
        function constructRule() {
          var cr = el.find('#constructRule span');
          if(!cr.length) return;

          newRule = {if:[],is:[],then:[],to:[]};

          var valAry = [];
          valAry.push({ key:'if', value: el.find('#ifSelectEl').val() });
          valAry.push({ key:'is', value: el.find('#isSelectEl').val() });
          valAry.push({ key:'then', value: el.find('#thenSelectEl').val() });
          valAry.push({ key:'to', value: el.find('#toSelectEl').val() });

          var crContent = [];
          for (var v = 0; v < valAry.length; v++) {
            var valItem = valAry[v];
            var tokenBuilder = getTokenBuilder(valItem.value);
            crContent.push(buildSpan(valItem.key,'m-1'));
            for (var i = 0; i < tokenBuilder.length; i++) {
              var token = tokenBuilder[i];
              newRule[valItem.key].push(token);
              if(token.key) {
                crContent.push(buildInput(valItem.key + 'Input' + token.key, 'col-5 d-inline'));
              } else {
                crContent.push(buildSpan(token.value,'m-1'));
              }
            }
          }
          cr.html(crContent.join(' '));
          console.log(newRule)
        }
        function buildSpan(content, _class) {
          var bs = [];
          var c = _class ? _class : '';
          bs.push('<span class="' + c + '">');
          bs.push(content);
          bs.push('</span>');
          return bs.join('');
        }
        function buildInput(id,_class) {
          var bi = [];
          bi.push('<input class="' + _class + ' form-control input-sm" id="');
          bi.push(id);
          bi.push('"></input>');
          return bi.join('');
        }
        function buildLabel(labelFor, content, _class) {
          var bl = [];
          var c = _class ? _class : 'col-1';
          bl.push('<label class="' + c + '" for="#' + labelFor + '">');
          bl.push(content);
          bl.push('</label>');
          return bl.join('');
        }
        function buildSelect(id, optionAry) {
          var bs = [];
          bs.push('<select class="form-control input-sm col-5" id="');
          bs.push(id);
          bs.push('">');
          bs.push('<option value=""></option>');
          for (var i = 0; i < optionAry.length; i++) {
            var option = optionAry[i];
            bs.push('<option value="'+option+'">'+option+'</option>');
          }
          bs.push('</select>');
          return bs.join('');
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
  
