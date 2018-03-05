(function(root,factory,plug){
    factory(root.jQuery,plug);
})(this,function($,plug){
    var _config={
        url:"",
        method:"get",
        dataType :"json",
        cache:false,
        queryParams: {}
    }
    var _methods ={
        init:function(){
            $.ajax({
                type: this.method || 'POST',
			    url:this.url,
			    data:this.queryParams,
			    dataType:this.dataType,
			    cache: this.cache,
			    success: function(res){
                    
                },
			    error: DWZ.ajaxError 
            })
        },
        addRow:function(){

        },
        deleteRow:function(){

        },
        getData:function(){

        }
    }
    $.fn[plug] = function(options){
        var value;
        this.each(function(){
            var $this=$(this);
            $.extend($this, _config,_methods,options);
            $this.init();
        });
    }
},"datagird")