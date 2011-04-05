/**
 * jQuery Upload Plugin
 *
 * Copyright (c)2011 Philipp Boes <pb@mostgreedy.com>
 * 
 */

(function($, undefined){
    
    var settings = {
        url: '',
        onload: function(e, xhr, num, total) { return true; },
        onprogress: function(e) { return true; },
        oncomplete: function(e, xhr, total) { return true; }
    };
    
    var upload = function ( options ) {
        
        options = $.extend(settings, options);
        
        var files = this.files,
            total = files.length,
            $this = $(this),
            self = this;
        
        // disable file input
        this.disabled = true;
        
        function upload( filenum ) {
            
            var xhr = new XMLHttpRequest();
            
            // xhr callbacks
            xhr.upload['onprogress'] = function(e) {
                return options.onprogress.apply(self, [e]);
            };
            
            xhr.onload = function(e) {
                
                if (filenum + 1 < total) {
                    upload((filenum+1));
                }
                
                options.onload.apply(self, [e, xhr, filenum, total]);
                if (filenum + 1 == total) options.oncomplete.apply(self, [e, xhr, total]);
            };
            
            xhr.onabort = function(e) {};
            xhr.onerror = function(e) {};
            
            // xhr connect
            xhr.open("post", options.url, true);
            xhr.setRequestHeader("Cache-Control", "no-cache");
            xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            xhr.setRequestHeader("X-File-Name", files[filenum].fileName);
            xhr.setRequestHeader("X-File-Size", files[filenum].fileSize);
            
            var f = new FormData();
		  f.append(self.name, files[filenum]);
		  xhr.send(f);
        }
        
        upload(0);
        return options.onstart.apply(self, [total]);
    }
    
    $.fn.upload = function( options ) {
        return this.each(function(){
            $(this).bind('change', function() {
                return upload.apply(this, [options]);
            });
        });
    }
    
})(jQuery);