app.service('fileUploader', function ($http, eventService) {
    this.upload = function(file, uploadUrl, callback){
    	//eventService.publish("loader.show");
        var fd = new FormData();
        fd.append('file', file);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .success(function(data){
        	callback(data);
        	//eventService.publish("loader.hide");
        })
        .error(function(){
        	//eventService.publish("loader.hide");
        });
    };
});