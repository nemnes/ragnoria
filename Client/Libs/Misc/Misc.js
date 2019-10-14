var Libs_Misc = {

  stripHtml: function (html) {
    return $($.parseHTML(html)).text();
  },

};