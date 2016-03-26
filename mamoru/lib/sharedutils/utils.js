Mamoru.Utils.inArray = function(arr,obj) {
                          return (arr.indexOf(obj) != -1);
                        }


// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};