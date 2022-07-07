Sanitize = {
  encode: function(str) {
    str = String(str);
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  },

  decode: function(str) {
    str = String(str);
    return str.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, '\'').replace(/&amp;/g, '&');
  },

  minimum_sanitize(str){
    str = Sanitize.encode(str);

    //&ampを&に復活
    str = str.replace(/&amp;(\w+);/g, '&$1;');

    //4桁5桁の特殊文字復活
    str = str.replace(/&amp;#([1-9][0-9]{3,4});/g, '&#$1;');

    return str;
  },

  exclude_inline_tag: function(str){
    str = Sanitize.minimum_sanitize(str);

    //brを復活
    str = str.replace(/&lt;br[\s\/]*&gt;/g, '<br/>');

    //sup,smallを復活
    str = str.replace(/&lt;(\/?)(sup|small|sub)&gt;/g, '<$1$2>');

    return str;
  },
};