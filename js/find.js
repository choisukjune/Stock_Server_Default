//-------------------------------------------------------;
var fileNm = "js/find.js";
if( console ) console.log( "[ S ] - " + fileNm + "----------" );
//-------------------------------------------------------;
(function(){
//-------------------------------------------------------;
// REQUIRE;
//-------------------------------------------------------;

var fs = require( "fs" );
var url = require('url');

var execSync = require('child_process').execSync;
var iconv = require( "iconv-lite" );
var spawn = require('child_process').spawn;

//-------------------------------------------------------;
// VARIABLE;
//-------------------------------------------------------;

var ROOT_PATH = process.cwd();

var CP_COMMAND = {};
	CP_COMMAND.MONGO = "..\\Binary\\Mongodb\\mongodb-win32-x86_64-windows-4.4.3\\bin\\mongo";
	//CP_COMMAND.MONGO = "mongo";

var DBJS_DIRECTORY_PATH = ROOT_PATH + "/dbjs/";
var _tDbjs_PATH = ROOT_PATH + "/tdbjs/";

//-------------------------------------------------------;
// FUNCTION;
//-------------------------------------------------------;
//-------------------------;
//-------------------------;
//-------------------------;
//-------------------------;
//-------------------------;

/*
 * @function
 * @param {String} dbjsNm
 * @param {boolean} bResult
 * @return {String} r
 */
var exec_query_DB = function( dbjsNm, bResult ){

	var DBJS_NM = dbjsNm;
	var FILE_PATH = ROOT_PATH + "/dbjs/" + DBJS_NM;
	var fileNm = ROOT_PATH + "\\result\\" + dbjsNm + "__" + Date.now() 
	
	var _t_command = CP_COMMAND.MONGO + " --username <!=ID=!> --password <!=PWD=!> --authenticationDatabase admin --host <!=HOST=!> --port <!=PORT=!> admin \"<!=FILE_PATH=!>\"";
	    _t_command = _t_command + " > " + fileNm + ".result";
	
	var command = _t_command.replace( "<!=ID=!>", global.CONST.MongoDB.OPTIONS.self.ID )
		.replace( "<!=PWD=!>", global.CONST.MongoDB.OPTIONS.self.PWD )
		.replace( "<!=HOST=!>", global.CONST.MongoDB.OPTIONS.self.HOST )
		.replace( "<!=PORT=!>", global.CONST.MongoDB.OPTIONS.self.PORT )
		.replace( "<!=FILE_PATH=!>", FILE_PATH );
	//console.log( command )
	execSync( command );
	var r = fs.readFileSync( fileNm + ".result" ).toString();
		r = deleteLines( r , 4 )
	return r;
};

//-------------------------;
//-------------------------;
//-------------------------;
//-------------------------;
//-------------------------;
/*
 * @function
 * @param {String} str
 * @param {Number} n
 * @return {String} str
 */
var deleteLines = function( str, n ){
	var i = 0,iLen = n,io;
	for(;i<iLen;++i){ str = str.slice(str.indexOf("\n") + 1, str.length ); }
	//str = str.replace( /\t/g, '' );
	//str = str.replace( /\r\n/g, '' );
	return str;
};
//-------------------------;
//-------------------------;
//-------------------------;
//-------------------------;
//-------------------------;
/*
 * @function
 * @param {String} url
 * @return {Object} o
 */
var paramToObject = function( _url ){
	
//	var r =  url.split("?")[ 1 ];
//	var a = r.split("&");
//	var o = {};
//	var i = 0,iLen = a.length,io;
//	
//	for(;i<iLen;++i){
//		io = a[ i ];
//		var _ta = io.split( "=" );
//		o[ _ta[0] ] = _ta[ 1 ];
//	}
//	console.log( o )
	var queryData = url.parse( _url, true).query;
	return queryData;
};

var numberWithCommas = function(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

var dateFormat_YYMMDDHHMMSS = function( date ){
	date = date || new Date();

	var YYYY = date.getFullYear();
	var MM = pad( date.getMonth() + 1, 2 );
	var DD = pad( date.getDate(), 2 );
	var H = pad( date.getHours(), 2 );
	var M = pad( date.getMinutes(), 2 );
	var S = pad( date.getSeconds(), 2 );

	return YYYY + MM + DD + H +  M + S;
};

var dateFormat_YYMMDD = function( date ){
	date = date || new Date();

	var YYYY = date.getFullYear();
	var MM = pad( date.getMonth() + 1, 2 );
	var DD = pad( date.getDate(), 2 );
//	var H = pad( date.getHours(), 2 );
//	var M = pad( date.getMinutes(), 2 );
//	var S = pad( date.getSeconds(), 2 );

	return YYYY + MM + DD;// + H +  M + S;
};



var pad = function(n, width){
	n = n + '';
	return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
}

//-------------------------;
//-------------------------;
//-------------------------;
//-------------------------;
//-------------------------;

//-------------------------------------------------------;
// ROUTER;
//-------------------------------------------------------;
//-------------------------;
//-------------------------;
//-------------------------;
//-------------------------;
//-------------------------;
	/**
	 * 쿼리파일을 실행하는 라우터
	 * @function
	 * @param {http.ClientRequest} req
	 * <code>
		{

		}
	* </code>
	*
	* @param {http.ClientResponse} res
	* <code>
		{

		}
	* </code>
	*
	* @example
	* <code>
		http://localhost:8888/find?brand=varihope&page=1
	* </code>
	*/
	global.server.addRouter("/find",function( req, res ){

		var routerNm = req.url.split("?")[0];
		var paramsO = paramToObject( req.url );
		var _tdbjs_nm = "find";
				

		res.statusCode = 200;
		res.setHeader( "Access-Control-Allow-Headers", "Content-Type" );
		res.setHeader( "Access-Control-Allow-Origin", "*" );
		res.setHeader( "Access-Control-Allow-Methods", "OPTIONS,POST,GET" );
		console.log( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ); 
		
		try
		{
			var _tQuery = fs.readFileSync( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ).toString();
		}
		catch( err )
		{
			console.log( routerNm + " - DBJS File Not Found! - " + err );
			res.end("{ sucess : 0, data : null }");
		}
		
		var query = _tQuery.replace( "<!=BRAND_NM=!>", paramsO.brandNm )
		.replace( "<!=PAGE=!>", paramsO.page );
		var dbjs_nm = "find_" + paramsO.brandNm + ".dbjs";

		var FILE_PATH = DBJS_DIRECTORY_PATH + dbjs_nm;
		
		console.log( FILE_PATH )

		fs.writeFileSync( DBJS_DIRECTORY_PATH + dbjs_nm , query, { flag : "w" } );
		var r = exec_query_DB( dbjs_nm )
		res.end( JSON.stringify( r ) )	

	});
	/**
	 * 쿼리파일을 실행하는 라우터
	 * @function
	 * @param {http.ClientRequest} req
	 * <code>
		{

		}
	* </code>
	*
	* @param {http.ClientResponse} res
	* <code>
		{

		}
	* </code>
	*
	* @example
	* <code>
		http://localhost:8888/findHashTag?tag=...&page=1
	* </code>
	*/
	global.server.addRouter("/findHashTag",function( req, res ){
		debugger;
		var routerNm = req.url.split("?")[0];
		var paramsO = paramToObject( decodeURIComponent( req.url  ));
		var _tdbjs_nm = "findHashTag";
				
		var _tag = decodeURIComponent( paramsO.tag )

		res.statusCode = 200;
		res.setHeader( "Access-Control-Allow-Headers", "Content-Type" );
		res.setHeader( "Access-Control-Allow-Origin", "*" );
		res.setHeader( "Access-Control-Allow-Methods", "OPTIONS,POST,GET" );
		console.log( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ); 
		
		try
		{
			var _tQuery = fs.readFileSync( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ).toString();
		}
		catch( err )
		{
			console.log( routerNm + " - DBJS File Not Found! - " + err );
			res.end("{ sucess : 0, data : null }");
		}
		
		var query = _tQuery.replace( "<!=TAG=!>", decodeURIComponent( paramsO.tag ) )
		.replace( "<!=PAGE=!>", paramsO.page )
		.replace( "<!=LIMIT=!>", paramsO.limit );
		var dbjs_nm = "find_" + _tag.replace(/\s/gi,"_") + ".dbjs";

		var FILE_PATH = DBJS_DIRECTORY_PATH + dbjs_nm;
		
		console.log( FILE_PATH )

		fs.writeFileSync( DBJS_DIRECTORY_PATH + dbjs_nm , query, { flag : "w" } );
		var r = exec_query_DB( dbjs_nm )
				
		res.end( r )


	});

	/**
	 * 쿼리파일을 실행하는 라우터
	 * @function
	 * @param {http.ClientRequest} req
	 * <code>
		{

		}
	* </code>
	*
	* @param {http.ClientResponse} res
	* <code>
		{

		}
	* </code>
	*
	* @example
	* <code>
		http://localhost:8888/findContentsAll?page=1
	* </code>
	*/
	global.server.addRouter("/findContentsAll",function( req, res ){
		debugger;
		var routerNm = req.url.split("?")[0];
		var paramsO = paramToObject( req.url );
		var _tdbjs_nm = "findContentsAll";
				
		var _tag = decodeURIComponent( paramsO.tag )

		res.statusCode = 200;
		res.setHeader( "Access-Control-Allow-Headers", "Content-Type" );
		res.setHeader( "Access-Control-Allow-Origin", "*" );
		res.setHeader( "Access-Control-Allow-Methods", "OPTIONS,POST,GET" );
		console.log( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ); 
		
		try
		{
			var _tQuery = fs.readFileSync( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ).toString();
		}
		catch( err )
		{
			console.log( routerNm + " - DBJS File Not Found! - " + err );
			res.end("{ sucess : 0, data : null }");
		}
		
		var query = _tQuery.replace( "<!=PAGE=!>", paramsO.page );
		var dbjs_nm = _tdbjs_nm + ".dbjs";

		var FILE_PATH = DBJS_DIRECTORY_PATH + dbjs_nm;
		
		console.log( FILE_PATH )

		fs.writeFileSync( DBJS_DIRECTORY_PATH + dbjs_nm , query, { flag : "w" } );
		var r = exec_query_DB( dbjs_nm )
		res.end( r )	

	});

	/**
	 * 쿼리파일을 실행하는 라우터
	 * @function
	 * @param {http.ClientRequest} req
	 * <code>
		{

		}
	* </code>
	*
	* @param {http.ClientResponse} res
	* <code>
		{

		}
	* </code>
	*
	* @example
	* <code>
		http://localhost:8888/findAll?page=1
	* </code>
	*/
	global.server.addRouter("/findAll",function( req, res ){
		debugger;
		var routerNm = req.url.split("?")[0];
		var paramsO = paramToObject( req.url );
		var _tdbjs_nm = "findAll";
				

		res.statusCode = 200;
		res.setHeader( "Access-Control-Allow-Headers", "Content-Type" );
		res.setHeader( "Access-Control-Allow-Origin", "*" );
		res.setHeader( "Access-Control-Allow-Methods", "OPTIONS,POST,GET" );
		console.log( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ); 
		
		try
		{
			var _tQuery = fs.readFileSync( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ).toString();
		}
		catch( err )
		{
			console.log( routerNm + " - DBJS File Not Found! - " + err );
			res.end("{ sucess : 0, data : null }");
		}
		
		var query = _tQuery.replace( "<!=PAGE=!>", paramsO.page )
				.replace( "<!=LIMIT=!>", paramsO.limit );
		var dbjs_nm = _tdbjs_nm + ".dbjs";

		var FILE_PATH = DBJS_DIRECTORY_PATH + dbjs_nm;
		
		console.log( FILE_PATH )

		fs.writeFileSync( DBJS_DIRECTORY_PATH + dbjs_nm , query, { flag : "w" } );
		var r = exec_query_DB( dbjs_nm )
		res.end( r )	

	});

	/**
	 * 쿼리파일을 실행하는 라우터
	 * @function
	 * @param {http.ClientRequest} req
	 * <code>
		{

		}
	* </code>
	*
	* @param {http.ClientResponse} res
	* <code>
		{

		}
	* </code>
	*
	* @example
	* <code>
		http://localhost:8888/find_report_All_by_brand?brand=varihope
	* </code>
	*/
	global.server.addRouter("/getTotalCount",function( req, res ){
		
		var routerNm = req.url.split("?")[0];
		var paramsO = paramToObject( req.url );
		var _tdbjs_nm = "getTotalCount";
				

		res.statusCode = 200;
		res.setHeader( "Access-Control-Allow-Headers", "Content-Type" );
		res.setHeader( "Access-Control-Allow-Origin", "*" );
		res.setHeader( "Access-Control-Allow-Methods", "OPTIONS,POST,GET" );
		console.log( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ); 
		
		try
		{
			var _tQuery = fs.readFileSync( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ).toString();
		}
		catch( err )
		{
			console.log( routerNm + " - DBJS File Not Found! - " + err );
			res.end("{ sucess : 0, data : null }");
		}
		
		var query = _tQuery.replace( "<!=COL_NM=!>", paramsO.colNm )
				.replace( "<!=DB_NM=!>", paramsO.dbNm );
		var dbjs_nm = "find_" + paramsO.colNm + ".dbjs";

		var FILE_PATH = DBJS_DIRECTORY_PATH + dbjs_nm;
		
		console.log( FILE_PATH )

		fs.writeFileSync( DBJS_DIRECTORY_PATH + dbjs_nm , query, { flag : "w" } );
		var r = exec_query_DB( dbjs_nm )
		res.end( r )	

	});

	/**
	 * 쿼리파일을 실행하는 라우터
	 * @function
	 * @param {http.ClientRequest} req
	 * <code>
		{

		}
	* </code>
	*
	* @param {http.ClientResponse} res
	* <code>
		{

		}
	* </code>
	*
	* @example
	* <code>
		http://localhost:8888/getHtml?fileNm=report_varihope_202008
	* </code>
	*/
	global.server.addRouter("/getHtml",function( req, res ){
		
		var routerNm = req.url.split("?")[0];
		var paramsO = paramToObject( req.url );
				
		res.statusCode = 200;
		res.setHeader( "Access-Control-Allow-Headers", "Content-Type" );
		res.setHeader( "Access-Control-Allow-Origin", "*" );
		res.setHeader( "Access-Control-Allow-Methods", "OPTIONS,POST,GET" );
		
		try
		{
			var _tHtml = fs.readFileSync( _thtml_PATH + "/" + paramsO.fileNm + ".thtml" ).toString();
		}
		catch( err )
		{
			console.log( routerNm + " - thtml File Not Found! - " + err );
			res.end("{ sucess : 0, data : null }");
		}

		res.end( _tHtml )	

	});

	/**
	 * 쿼리파일을 실행하는 라우터
	 * @function
	 * @param {http.ClientRequest} req
	 * <code>
		{

		}
	* </code>
	*
	* @param {http.ClientResponse} res
	* <code>
		{

		}
	* </code>
	*
	* @example
	* <code>
		http://localhost:8888/getTags
	* </code>
	*/
	global.server.addRouter("/getTags",function( req, res ){
		
		var routerNm = req.url.split("?")[0];
		//var paramsO = paramToObject( req.url );
		var _tdbjs_nm = "getTags";
				

		res.statusCode = 200;
		res.setHeader( "Access-Control-Allow-Headers", "Content-Type" );
		res.setHeader( "Access-Control-Allow-Origin", "*" );
		res.setHeader( "Access-Control-Allow-Methods", "OPTIONS,POST,GET" );
		console.log( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ); 
		
		try
		{
			var _tQuery = fs.readFileSync( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ).toString();
		}
		catch( err )
		{
			console.log( routerNm + " - DBJS File Not Found! - " + err );
			res.end("{ sucess : 0, data : null }");
		}
		
		var query = _tQuery//.replace( "<!=COL_NM=!>", paramsO.colNm );
		var dbjs_nm = "find_" + _tdbjs_nm + ".dbjs";

		var FILE_PATH = DBJS_DIRECTORY_PATH + dbjs_nm;
		
		console.log( FILE_PATH )

		fs.writeFileSync( DBJS_DIRECTORY_PATH + dbjs_nm , query, { flag : "w" } );
		var r = exec_query_DB( dbjs_nm )
		res.end( r )	

	});
	/**
	 * 쿼리파일을 실행하는 라우터
	 * @function
	 * @param {http.ClientRequest} req
	 * <code>
		{

		}
	* </code>
	*
	* @param {http.ClientResponse} res
	* <code>
		{

		}
	* </code>
	*
	* @example
	* <code>
		http://localhost:8888/findContentsAll?page=1
	* </code>
	*/
	global.server.addRouter("/searchProduct",function( req, res ){
		debugger;
		var routerNm = req.url.split("?")[0];
		var paramsO = paramToObject( decodeURIComponent( req.url  ));
		var _tdbjs_nm = "searchProduct";

		res.statusCode = 200;
		res.setHeader( "Access-Control-Allow-Headers", "Content-Type" );
		res.setHeader( "Access-Control-Allow-Origin", "*" );
		res.setHeader( "Access-Control-Allow-Methods", "OPTIONS,POST,GET" );
		console.log( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ); 
		
		try
		{
			var _tQuery = fs.readFileSync( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ).toString();
		}
		catch( err )
		{
			console.log( routerNm + " - DBJS File Not Found! - " + err );
			res.end("{ sucess : 0, data : null }");
		}
		
		var query = _tQuery.replace( "<!=PAGE=!>", paramsO.page )
			.replace( "<!=LIMIT=!>", paramsO.limit )
			.replace( "<!=KEYWORD=!>", paramsO.keyword )
			.replace( "<!=PAGE=!>", paramsO.page );
		var dbjs_nm = _tdbjs_nm + ".dbjs";

		var FILE_PATH = DBJS_DIRECTORY_PATH + dbjs_nm;
		
		console.log( FILE_PATH )

		fs.writeFileSync( DBJS_DIRECTORY_PATH + dbjs_nm , query, { flag : "w" } );
		var r = exec_query_DB( dbjs_nm )

		res.end( r )	

	});
	/**
	 * 쿼리파일을 실행하는 라우터
	 * @function
	 * @param {http.ClientRequest} req
	 * <code>
		{

		}
	* </code>
	*
	* @param {http.ClientResponse} res
	* <code>
		{

		}
	* </code>
	*
	* @example
	* <code>
		http://localhost:8888/findContentsAll?page=1
	* </code>
	*/
	global.server.addRouter("/searchByShop",function( req, res ){
		
		var routerNm = req.url.split("?")[0];
		var paramsO = paramToObject( decodeURIComponent( req.url  ));
		var _tdbjs_nm = "searchByShop";

		res.statusCode = 200;
		res.setHeader( "Access-Control-Allow-Headers", "Content-Type" );
		res.setHeader( "Access-Control-Allow-Origin", "*" );
		res.setHeader( "Access-Control-Allow-Methods", "OPTIONS,POST,GET" );
		console.log( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ); 
		
		try
		{
			var _tQuery = fs.readFileSync( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ).toString();
		}
		catch( err )
		{
			console.log( routerNm + " - DBJS File Not Found! - " + err );
			res.end("{ sucess : 0, data : null }");
		}
		
		var query = _tQuery.replace( "<!=PAGE=!>", paramsO.page )
			.replace( "<!=LIMIT=!>", paramsO.limit )
			.replace( "<!=SHOP=!>", paramsO.shop )
			.replace( "<!=PAGE=!>", paramsO.page );
		var dbjs_nm = _tdbjs_nm + ".dbjs";

		var FILE_PATH = DBJS_DIRECTORY_PATH + dbjs_nm;
		
		console.log( FILE_PATH )

		fs.writeFileSync( DBJS_DIRECTORY_PATH + dbjs_nm , query, { flag : "w" } );
		var r = exec_query_DB( dbjs_nm )


		res.end( r )	

	});
	/**
	 * 쿼리파일을 실행하는 라우터
	 * @function
	 * @param {http.ClientRequest} req
	 * <code>
		{

		}
	* </code>
	*
	* @param {http.ClientResponse} res
	* <code>
		{

		}
	* </code>
	*
	* @example
	* <code>
		http://localhost:8888/findContentsAll?page=1
	* </code>
	*/
	global.server.addRouter("/searchByBrand",function( req, res ){
		debugger;
		var routerNm = req.url.split("?")[0];
		var paramsO = paramToObject( decodeURIComponent( req.url  ));
		var _tdbjs_nm = "searchByBrand";

		res.statusCode = 200;
		res.setHeader( "Access-Control-Allow-Headers", "Content-Type" );
		res.setHeader( "Access-Control-Allow-Origin", "*" );
		res.setHeader( "Access-Control-Allow-Methods", "OPTIONS,POST,GET" );
		console.log( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ); 
		
		try
		{
			var _tQuery = fs.readFileSync( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ).toString();
		}
		catch( err )
		{
			console.log( routerNm + " - DBJS File Not Found! - " + err );
			res.end("{ sucess : 0, data : null }");
		}
		
		var query = _tQuery.replace( "<!=PAGE=!>", paramsO.page )
			.replace( "<!=LIMIT=!>", paramsO.limit )
			.replace( "<!=BRAND=!>", paramsO.brand )
			.replace( "<!=PAGE=!>", paramsO.page );
		var dbjs_nm = _tdbjs_nm + ".dbjs";

		var FILE_PATH = DBJS_DIRECTORY_PATH + dbjs_nm;
		
		console.log( FILE_PATH )

		fs.writeFileSync( DBJS_DIRECTORY_PATH + dbjs_nm , query, { flag : "w" } );
		var r = exec_query_DB( dbjs_nm )

		res.end( r )	

	});
	/**
	 * 쿼리파일을 실행하는 라우터
	 * @function
	 * @param {http.ClientRequest} req
	 * <code>
		{

		}
	* </code>
	*
	* @param {http.ClientResponse} res
	* <code>
		{

		}
	* </code>
	*
	* @example
	* <code>
		http://localhost:8888/find?brand=varihope&page=1
	* </code>
	*/
	global.server.addRouter("/getInsightByTrad",function( req, res ){

		var routerNm = req.url.split("?")[0];
		var paramsO = paramToObject( req.url );
		var _tdbjs_nm = "getInsightByTrad";
				

		res.statusCode = 200;
		res.setHeader( "Access-Control-Allow-Headers", "Content-Type" );
		res.setHeader( "Access-Control-Allow-Origin", "*" );
		res.setHeader( "Access-Control-Allow-Methods", "OPTIONS,POST,GET" );
		res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'})
		
		
		console.log( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ); 
		
		try
		{
			var _tQuery = fs.readFileSync( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ).toString();
		}
		catch( err )
		{
			console.log( routerNm + " - DBJS File Not Found! - " + err );
			res.end("{ sucess : 0, data : null }");
		}
		
		var query = _tQuery
			.replace( "<!=DATE=!>", paramsO.date )
		//.replace( "<!=PAGE=!>", paramsO.page );
		var dbjs_nm = "getInsightByTrad.dbjs";

		var FILE_PATH = DBJS_DIRECTORY_PATH + dbjs_nm;
		
		console.log( FILE_PATH )

		fs.writeFileSync( DBJS_DIRECTORY_PATH + dbjs_nm , query, { flag : "w" } );
		var r = exec_query_DB( dbjs_nm )
		res.end(  r  )

	});
	/**
	 * 쿼리파일을 실행하는 라우터
	 * @function
	 * @param {http.ClientRequest} req
	 * <code>
		{

		}
	* </code>
	*
	* @param {http.ClientResponse} res
	* <code>
		{

		}
	* </code>
	*
	* @example
	* <code>
		http://localhost:8888/find?brand=varihope&page=1
	* </code>
	*/
	global.server.addRouter("/insightByStock",function( req, res ){

		var routerNm = req.url.split("?")[0];
		var paramsO = paramToObject( req.url );
		var _tdbjs_nm = "insightByStock";
				

		res.statusCode = 200;
		res.setHeader( "Access-Control-Allow-Headers", "Content-Type" );
		res.setHeader( "Access-Control-Allow-Origin", "*" );
		res.setHeader( "Access-Control-Allow-Methods", "OPTIONS,POST,GET" );
		res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'})
		
		
		console.log( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ); 
		
		try
		{
			var _tQuery = fs.readFileSync( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ).toString();
		}
		catch( err )
		{
			console.log( routerNm + " - DBJS File Not Found! - " + err );
			res.end("{ sucess : 0, data : null }");
		}
		
		var query = _tQuery
		//.replace( "<!=BRAND_NM=!>", paramsO.brandNm )
		//.replace( "<!=PAGE=!>", paramsO.page );
		var dbjs_nm = "insightByStock.dbjs";

		var FILE_PATH = DBJS_DIRECTORY_PATH + dbjs_nm;
		
		console.log( FILE_PATH )

		fs.writeFileSync( DBJS_DIRECTORY_PATH + dbjs_nm , query, { flag : "w" } );
		var r = exec_query_DB( dbjs_nm )
		res.end(  r  )

	});
	/**
	 * 쿼리파일을 실행하는 라우터
	 * @function
	 * @param {http.ClientRequest} req
	 * <code>
		{

		}
	* </code>
	*
	* @param {http.ClientResponse} res
	* <code>
		{

		}
	* </code>
	*
	* @example
	* <code>
		http://localhost:8888/find?brand=varihope&page=1
	* </code>
	*/
	global.server.addRouter("/getInsightByStock",function( req, res ){

		var routerNm = req.url.split("?")[0];
		var paramsO = paramToObject( req.url );
		var _tdbjs_nm = "getInsightByStock";
				

		res.statusCode = 200;
		res.setHeader( "Access-Control-Allow-Headers", "Content-Type" );
		res.setHeader( "Access-Control-Allow-Origin", "*" );
		res.setHeader( "Access-Control-Allow-Methods", "OPTIONS,POST,GET" );
		res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'})
		
		
		console.log( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ); 
		
		try
		{
			var _tQuery = fs.readFileSync( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ).toString();
		}
		catch( err )
		{
			console.log( routerNm + " - DBJS File Not Found! - " + err );
			res.end("{ sucess : 0, data : null }");
		}

		var query = _tQuery
			.replace( "<!=DATE=!>", paramsO.date )
		//.replace( "<!=PAGE=!>", paramsO.page );
		var dbjs_nm = "getInsightByStock.dbjs";

		var FILE_PATH = DBJS_DIRECTORY_PATH + dbjs_nm;
		
		console.log( FILE_PATH )

		fs.writeFileSync( DBJS_DIRECTORY_PATH + dbjs_nm , query, { flag : "w" } );
		var r = exec_query_DB( dbjs_nm )
		res.end(  r  )

	});

/**
	 * 쿼리파일을 실행하는 라우터
	 * @function
	 * @param {http.ClientRequest} req
	 * <code>
		{

		}
	* </code>
	*
	* @param {http.ClientResponse} res
	* <code>
		{

		}
	* </code>
	*
	* @example
	* <code>
		http://localhost:8888/getInsightByStockCd?date=20220210&cd=035080
	* </code>
	*/
	global.server.addRouter("/getInsightByStockCd",function( req, res ){

		var routerNm = req.url.split("?")[0];
		var paramsO = paramToObject( req.url );
		var _tdbjs_nm = "getInsightByStockCd";
				

		res.statusCode = 200;
		res.setHeader( "Access-Control-Allow-Headers", "Content-Type" );
		res.setHeader( "Access-Control-Allow-Origin", "*" );
		res.setHeader( "Access-Control-Allow-Methods", "OPTIONS,POST,GET" );
		res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'})
		
		
		console.log( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ); 
		
		try
		{
			var _tQuery = fs.readFileSync( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ).toString();
		}
		catch( err )
		{
			console.log( routerNm + " - DBJS File Not Found! - " + err );
			res.end("{ sucess : 0, data : null }");
		}

		var query = _tQuery
			.replace( "<!=DATE=!>", paramsO.date )
		.replace( "<!=CD=!>", paramsO.cd );
		var dbjs_nm = "getInsightByStockCd.dbjs";

		var FILE_PATH = DBJS_DIRECTORY_PATH + dbjs_nm;
		
		console.log( FILE_PATH )

		fs.writeFileSync( DBJS_DIRECTORY_PATH + dbjs_nm , query, { flag : "w" } );
		var r = exec_query_DB( dbjs_nm )
		res.end(  r  )

	});
	/**
	 * 쿼리파일을 실행하는 라우터
	 * @function
	 * @param {http.ClientRequest} req
	 * <code>
		{

		}
	* </code>
	*
	* @param {http.ClientResponse} res
	* <code>
		{

		}
	* </code>
	*
	* @example
	* <code>
		http://localhost:8888/find?brand=varihope&page=1
	* </code>
	*/
	global.server.addRouter("/find_stockInsight",function( req, res ){

		var routerNm = req.url.split("?")[0];
		var paramsO = paramToObject( req.url );
		var _tdbjs_nm = "find_stockInsight";
				

		res.statusCode = 200;
		res.setHeader( "Access-Control-Allow-Headers", "Content-Type" );
		res.setHeader( "Access-Control-Allow-Origin", "*" );
		res.setHeader( "Access-Control-Allow-Methods", "OPTIONS,POST,GET" );
		res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'})
		
		
		console.log( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ); 
		
		try
		{
			var _tQuery = fs.readFileSync( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ).toString();
		}
		catch( err )
		{
			console.log( routerNm + " - DBJS File Not Found! - " + err );
			res.end("{ sucess : 0, data : null }");
		}
		
		var query = _tQuery
		//.replace( "<!=BRAND_NM=!>", paramsO.brandNm )
		//.replace( "<!=PAGE=!>", paramsO.page );
		var dbjs_nm = "find_stockInsight.dbjs";

		var FILE_PATH = DBJS_DIRECTORY_PATH + dbjs_nm;
		
		console.log( FILE_PATH )

		fs.writeFileSync( DBJS_DIRECTORY_PATH + dbjs_nm , query, { flag : "w" } );
		var r = exec_query_DB( dbjs_nm )
		res.end(  r  )

	});

	/**
	 * 쿼리파일을 실행하는 라우터
	 * @function
	 * @param {http.ClientRequest} req
	 * <code>
		{

		}
	* </code>
	*
	* @param {http.ClientResponse} res
	* <code>
		{

		}
	* </code>
	*
	* @example
	* <code>
		http://localhost:8888/find?brand=varihope&page=1
	* </code>
	*/
	global.server.addRouter("/getSiseByCd",function( req, res ){

		var routerNm = req.url.split("?")[0];
		var paramsO = paramToObject( req.url );
		var _tdbjs_nm = "getSiseByCd";
				

		res.statusCode = 200;
		res.setHeader( "Access-Control-Allow-Headers", "Content-Type" );
		res.setHeader( "Access-Control-Allow-Origin", "*" );
		res.setHeader( "Access-Control-Allow-Methods", "OPTIONS,POST,GET" );
		res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'})
		
		
		console.log( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ); 
		
		try
		{
			var _tQuery = fs.readFileSync( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ).toString();
		}
		catch( err )
		{
			console.log( routerNm + " - DBJS File Not Found! - " + err );
			res.end("{ sucess : 0, data : null }");
		}
		
		var query = _tQuery
			.replace( "<!=CD=!>", paramsO.brandNm )
			.replace( "<!=DATE=!>", paramsO.page );
		var dbjs_nm = "getSiseByCd.dbjs";

		var FILE_PATH = DBJS_DIRECTORY_PATH + dbjs_nm;
		
		console.log( FILE_PATH )

		fs.writeFileSync( DBJS_DIRECTORY_PATH + dbjs_nm , query, { flag : "w" } );
		var r = exec_query_DB( dbjs_nm )
		res.end(  r  )

	});

	/**
	 * 쿼리파일을 실행하는 라우터
	 * @function
	 * @param {http.ClientRequest} req
	 * <code>
		{

		}
	* </code>
	*
	* @param {http.ClientResponse} res
	* <code>
		{

		}
	* </code>
	*
	* @example
	* <code>
		http://localhost:8888/find?brand=varihope&page=1
	* </code>
	*/
	global.server.addRouter("/test_scatter",function( req, res ){

		var routerNm = req.url.split("?")[0];
		var paramsO = paramToObject( req.url );
		var _tdbjs_nm = "test_scatter";
				

		res.statusCode = 200;
		res.setHeader( "Access-Control-Allow-Headers", "Content-Type" );
		res.setHeader( "Access-Control-Allow-Origin", "*" );
		res.setHeader( "Access-Control-Allow-Methods", "OPTIONS,POST,GET" );
		res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'})
		
		
		console.log( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ); 
		
		try
		{
			var _tQuery = fs.readFileSync( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ).toString();
		}
		catch( err )
		{
			console.log( routerNm + " - DBJS File Not Found! - " + err );
			res.end("{ sucess : 0, data : null }");
		}
		
		var query = _tQuery
		//.replace( "<!=BRAND_NM=!>", paramsO.brandNm )
		//.replace( "<!=PAGE=!>", paramsO.page );
		var dbjs_nm = "test_scatter.dbjs";

		var FILE_PATH = DBJS_DIRECTORY_PATH + dbjs_nm;
		
		console.log( FILE_PATH )

		fs.writeFileSync( DBJS_DIRECTORY_PATH + dbjs_nm , query, { flag : "w" } );
		var r = exec_query_DB( dbjs_nm )
		res.end(  r  )

	});
	/**
	 * 쿼리파일을 실행하는 라우터
	 * @function
	 * @param {http.ClientRequest} req
	 * <code>
		{

		}
	* </code>
	*
	* @param {http.ClientResponse} res
	* <code>
		{

		}
	* </code>
	*
	* @example
	* <code>
		http://localhost:8888/getAcgDataByCd?cd=000660&start=20220301&end=20220318
	* </code>
	*/
	global.server.addRouter("/getAcgDataByCd",function( req, res ){

		var routerNm = req.url.split("?")[0];
		var paramsO = paramToObject( req.url );
		var _tdbjs_nm = "getAcgDataByCd";
				

		res.statusCode = 200;
		res.setHeader( "Access-Control-Allow-Headers", "Content-Type" );
		res.setHeader( "Access-Control-Allow-Origin", "*" );
		res.setHeader( "Access-Control-Allow-Methods", "OPTIONS,POST,GET" );
		res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'})
		
		
		console.log( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ); 
		
		try
		{
			var _tQuery = fs.readFileSync( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ).toString();
		}
		catch( err )
		{
			console.log( routerNm + " - DBJS File Not Found! - " + err );
			res.end("{ sucess : 0, data : null }");
		}
		
		var query = _tQuery
			.replace( "<!=CD=!>", paramsO.cd )
			.replace( "<!=START=!>", paramsO.start )
			.replace( "<!=END=!>", paramsO.end );
		var dbjs_nm = "getAcgDataByCd.dbjs";

		var FILE_PATH = DBJS_DIRECTORY_PATH + dbjs_nm;
		
		console.log( FILE_PATH )

		fs.writeFileSync( DBJS_DIRECTORY_PATH + dbjs_nm , query, { flag : "w" } );
		var r = exec_query_DB( dbjs_nm )
		res.end(  r  )

	});
	/**
	 * 쿼리파일을 실행하는 라우터
	 * @function
	 * @param {http.ClientRequest} req
	 * <code>
		{

		}
	* </code>
	*
	* @param {http.ClientResponse} res
	* <code>
		{

		}
	* </code>
	*
	* @example
	* <code>
		http://localhost:8888/getTrStatusByCd?cd=000660
	* </code>
	*/
	global.server.addRouter("/getTrStatusByCd",function( req, res ){

		var routerNm = req.url.split("?")[0];
		var paramsO = paramToObject( req.url );
//		var _tdbjs_nm = "test_scatter";
				

		res.statusCode = 200;
		res.setHeader( "Access-Control-Allow-Headers", "Content-Type" );
		res.setHeader( "Access-Control-Allow-Origin", "*" );
		res.setHeader( "Access-Control-Allow-Methods", "OPTIONS,POST,GET" );
		res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'})
		
		
		//console.log( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ); 
		
		//try
		//{
		//	var _tQuery = fs.readFileSync( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ).toString();
		//}
		//catch( err )
		//{
		//	console.log( routerNm + " - DBJS File Not Found! - " + err );
		//	res.end("{ sucess : 0, data : null }");
		//}
		
		//var query = _tQuery
		////.replace( "<!=BRAND_NM=!>", paramsO.brandNm )
		////.replace( "<!=PAGE=!>", paramsO.page );
		//var dbjs_nm = "test_scatter.dbjs";

		//var FILE_PATH = DBJS_DIRECTORY_PATH + dbjs_nm;
		
		//console.log( FILE_PATH )

		//fs.writeFileSync( DBJS_DIRECTORY_PATH + dbjs_nm , query, { flag : "w" } );
		//var r = exec_query_DB( dbjs_nm )

		var command = `call "c:\\Program Files\\AutoHotkey\\AutoHotkey.exe" "종목별투자자저장.ahk" ${paramsO.cd}`;

		var r = execSync( command );
		console.log( iconv.decode( r, 'EUC-KR').toString() );

		getTrStatusByCdResponse(`./data/05/json/${paramsO.cd}.json`,function( r ){
			res.end(  r  )
		})

	});
	var getTrStatusByCdResponse = function( path, cbFunction ){
		if(fs.existsSync( path ) )
		{
			var r = fs.readFileSync( path ).toString();
			cbFunction( r )
		} 
		else
		{
			setTimeout(function(){
				console.log( 'wait 500!')
				getTrStatusByCdResponse( path,cbFunction )
			},500) 
			
		} 


	}
	/**
	 * 쿼리파일을 실행하는 라우터
	 * @function
	 * @param {http.ClientRequest} req
	 * <code>
		{

		}
	* </code>
	*
	* @param {http.ClientResponse} res
	* <code>
		{

		}
	* </code>
	*
	* @example
	* <code>
		http://localhost:8888/find?brand=varihope&page=1
	* </code>
	*/
	global.server.addRouter("/getMassTradCheck_b",function( req, res ){

		var routerNm = req.url.split("?")[0];
		var paramsO = paramToObject( req.url );
		var _tdbjs_nm = "getMassTradCheck_b";
				

		res.statusCode = 200;
		res.setHeader( "Access-Control-Allow-Headers", "Content-Type" );
		res.setHeader( "Access-Control-Allow-Origin", "*" );
		res.setHeader( "Access-Control-Allow-Methods", "OPTIONS,POST,GET" );
		res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'})
		
		console.log( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ); 
		
		try
		{
			var _tQuery = fs.readFileSync( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ).toString();
		}
		catch( err )
		{
			console.log( routerNm + " - DBJS File Not Found! - " + err );
			res.end("{ sucess : 0, data : null }");
		}

		var lidx = 0;
		if( paramsO.lidx ) lidx = paramsO.lidx;
		var limit = 100;
		if( paramsO.limit ) limit = paramsO.limit;
		var query = _tQuery
			.replace( /<!=COL_NM=!>/gi, paramsO.date )
			.replace( "<!=LAST_IDX=!>", lidx )
			.replace( "<!=LIMIT=!>", limit );
			
		var dbjs_nm = "getMassTradCheck_b.dbjs";

		var FILE_PATH = DBJS_DIRECTORY_PATH + dbjs_nm;
		
		//console.log( FILE_PATH )

		fs.writeFileSync( DBJS_DIRECTORY_PATH + dbjs_nm , query, { flag : "w" } );
		var r = exec_query_DB( dbjs_nm )
		res.end(  r  )

	});
		/**
	 * 쿼리파일을 실행하는 라우터
	 * @function
	 * @param {http.ClientRequest} req
	 * <code>
		{

		}
	* </code>
	*
	* @param {http.ClientResponse} res
	* <code>
		{

		}
	* </code>
	*
	* @example
	* <code>
		http://localhost:8888/find?brand=varihope&page=1
	* </code>
	*/
	global.server.addRouter("/getMassTradCheck_s",function( req, res ){

		var routerNm = req.url.split("?")[0];
		var paramsO = paramToObject( req.url );
		var _tdbjs_nm = "getMassTradCheck_s";
				

		res.statusCode = 200;
		res.setHeader( "Access-Control-Allow-Headers", "Content-Type" );
		res.setHeader( "Access-Control-Allow-Origin", "*" );
		res.setHeader( "Access-Control-Allow-Methods", "OPTIONS,POST,GET" );
		res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'})
		
		console.log( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ); 
		
		try
		{
			var _tQuery = fs.readFileSync( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ).toString();
		}
		catch( err )
		{
			console.log( routerNm + " - DBJS File Not Found! - " + err );
			res.end("{ sucess : 0, data : null }");
		}

		var lidx = 0;
		if( paramsO.lidx ) lidx = paramsO.lidx;
		var limit = 100;
		if( paramsO.limit ) limit = paramsO.limit;
		var query = _tQuery
			.replace( /<!=COL_NM=!>/gi, paramsO.date )
			.replace( "<!=LAST_IDX=!>", lidx )
			.replace( "<!=LIMIT=!>", limit );
			
		var dbjs_nm = "getMassTradCheck_s.dbjs";

		var FILE_PATH = DBJS_DIRECTORY_PATH + dbjs_nm;
		
		//console.log( FILE_PATH )

		fs.writeFileSync( DBJS_DIRECTORY_PATH + dbjs_nm , query, { flag : "w" } );
		var r = exec_query_DB( dbjs_nm )
		res.end(  r  )

	});
		/**
	 * 쿼리파일을 실행하는 라우터
	 * @function
	 * @param {http.ClientRequest} req
	 * <code>
		{

		}
	* </code>
	*
	* @param {http.ClientResponse} res
	* <code>
		{

		}
	* </code>
	*
	* @example
	* <code>
		http://localhost:8888/find?brand=varihope&page=1
	* </code>
	*/
	global.server.addRouter("/getMassTradRank_b",function( req, res ){
		
		var routerNm = req.url.split("?")[0];
		var paramsO = paramToObject( req.url );
		var _tdbjs_nm = "getMassTradRank_b";
				

		res.statusCode = 200;
		res.setHeader( "Access-Control-Allow-Headers", "Content-Type" );
		res.setHeader( "Access-Control-Allow-Origin", "*" );
		res.setHeader( "Access-Control-Allow-Methods", "OPTIONS,POST,GET" );
		res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'})
		
		console.log( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ); 
		
		try
		{
			var _tQuery = fs.readFileSync( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ).toString();
		}
		catch( err )
		{
			console.log( routerNm + " - DBJS File Not Found! - " + err );
			res.end("{ sucess : 0, data : null }");
		}

		var lidx = 0;
		if( paramsO.lidx ) lidx = paramsO.lidx;
		var limit = 100;
		if( paramsO.limit ) limit = paramsO.limit;
		var query = _tQuery
			.replace( "<!=COL_NM=!>", paramsO.date )
			//.replace( "<!=LAST_IDX=!>", lidx )
			//.replace( "<!=LIMIT=!>", limit );
			
		var dbjs_nm = "getMassTradRank_b.dbjs";

		var FILE_PATH = DBJS_DIRECTORY_PATH + dbjs_nm;
		
		//console.log( FILE_PATH )

		fs.writeFileSync( DBJS_DIRECTORY_PATH + dbjs_nm , query, { flag : "w" } );
		var r = exec_query_DB( dbjs_nm )
		res.end(  r  )

	});

		/**
	 * 쿼리파일을 실행하는 라우터
	 * @function
	 * @param {http.ClientRequest} req
	 * <code>
		{

		}
	* </code>
	*
	* @param {http.ClientResponse} res
	* <code>
		{

		}
	* </code>
	*
	* @example
	* <code>
		http://localhost:8888/find?brand=varihope&page=1
	* </code>
	*/
	global.server.addRouter("/getMassTradRank_b_Cd",function( req, res ){
		
		var routerNm = req.url.split("?")[0];
		var paramsO = paramToObject( req.url );
		var _tdbjs_nm = "getMassTradRank_b_Cd";
				

		res.statusCode = 200;
		res.setHeader( "Access-Control-Allow-Headers", "Content-Type" );
		res.setHeader( "Access-Control-Allow-Origin", "*" );
		res.setHeader( "Access-Control-Allow-Methods", "OPTIONS,POST,GET" );
		res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'})
		
		console.log( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ); 
		
		try
		{
			var _tQuery = fs.readFileSync( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ).toString();
		}
		catch( err )
		{
			console.log( routerNm + " - DBJS File Not Found! - " + err );
			res.end("{ sucess : 0, data : null }");
		}

		var lidx = 0;
		if( paramsO.lidx ) lidx = paramsO.lidx;
		var limit = 100;
		if( paramsO.limit ) limit = paramsO.limit;
		var query = _tQuery
			.replace( "<!=COL_NM=!>", paramsO.date )
			.replace( "<!=CD=!>", paramsO.cd )
			//.replace( "<!=LIMIT=!>", limit );
			
		var dbjs_nm = "getMassTradRank_b_Cd.dbjs";

		var FILE_PATH = DBJS_DIRECTORY_PATH + dbjs_nm;
		
		//console.log( FILE_PATH )

		fs.writeFileSync( DBJS_DIRECTORY_PATH + dbjs_nm , query, { flag : "w" } );
		var r = exec_query_DB( dbjs_nm )
		res.end(  r  )

	});


			/**
	 * 쿼리파일을 실행하는 라우터
	 * @function
	 * @param {http.ClientRequest} req
	 * <code>
		{

		}
	* </code>
	*
	* @param {http.ClientResponse} res
	* <code>
		{

		}
	* </code>
	*
	* @example
	* <code>
		http://localhost:8888/find?brand=varihope&page=1
	* </code>
	*/
	global.server.addRouter("/getMassTradRank_s",function( req, res ){

		var routerNm = req.url.split("?")[0];
		var paramsO = paramToObject( req.url );
		var _tdbjs_nm = "getMassTradRank_s";
				

		res.statusCode = 200;
		res.setHeader( "Access-Control-Allow-Headers", "Content-Type" );
		res.setHeader( "Access-Control-Allow-Origin", "*" );
		res.setHeader( "Access-Control-Allow-Methods", "OPTIONS,POST,GET" );
		res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'})
		
		console.log( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ); 
		
		try
		{
			var _tQuery = fs.readFileSync( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ).toString();
		}
		catch( err )
		{
			console.log( routerNm + " - DBJS File Not Found! - " + err );
			res.end("{ sucess : 0, data : null }");
		}

		var lidx = 0;
		if( paramsO.lidx ) lidx = paramsO.lidx;
		var limit = 100;
		if( paramsO.limit ) limit = paramsO.limit;
		var query = _tQuery
			.replace( "<!=COL_NM=!>", paramsO.date )
			//.replace( "<!=LAST_IDX=!>", lidx )
			//.replace( "<!=LIMIT=!>", limit );
			
		var dbjs_nm = "getMassTradRank_s.dbjs";

		var FILE_PATH = DBJS_DIRECTORY_PATH + dbjs_nm;
		
		//console.log( FILE_PATH )

		fs.writeFileSync( DBJS_DIRECTORY_PATH + dbjs_nm , query, { flag : "w" } );
		var r = exec_query_DB( dbjs_nm )
		res.end(  r  )

	});
		/**
	 * 쿼리파일을 실행하는 라우터
	 * @function
	 * @param {http.ClientRequest} req
	 * <code>
		{

		}
	* </code>
	*
	* @param {http.ClientResponse} res
	* <code>
		{

		}
	* </code>
	*
	* @example
	* <code>
		http://localhost:8888/find?brand=varihope&page=1
	* </code>
	*/
	global.server.addRouter("/getMassTradRank_s_Cd",function( req, res ){
		
		var routerNm = req.url.split("?")[0];
		var paramsO = paramToObject( req.url );
		var _tdbjs_nm = "getMassTradRank_s_Cd";
				

		res.statusCode = 200;
		res.setHeader( "Access-Control-Allow-Headers", "Content-Type" );
		res.setHeader( "Access-Control-Allow-Origin", "*" );
		res.setHeader( "Access-Control-Allow-Methods", "OPTIONS,POST,GET" );
		res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'})
		
		console.log( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ); 
		
		try
		{
			var _tQuery = fs.readFileSync( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ).toString();
		}
		catch( err )
		{
			console.log( routerNm + " - DBJS File Not Found! - " + err );
			res.end("{ sucess : 0, data : null }");
		}

		var lidx = 0;
		if( paramsO.lidx ) lidx = paramsO.lidx;
		var limit = 100;
		if( paramsO.limit ) limit = paramsO.limit;
		var query = _tQuery
			.replace( "<!=COL_NM=!>", paramsO.date )
			.replace( "<!=CD=!>", paramsO.cd )
			//.replace( "<!=LIMIT=!>", limit );
			
		var dbjs_nm = "getMassTradRank_s_Cd.dbjs";

		var FILE_PATH = DBJS_DIRECTORY_PATH + dbjs_nm;
		
		//console.log( FILE_PATH )

		fs.writeFileSync( DBJS_DIRECTORY_PATH + dbjs_nm , query, { flag : "w" } );
		var r = exec_query_DB( dbjs_nm )
		res.end(  r  )

	});
		/**
	 * 쿼리파일을 실행하는 라우터
	 * @function
	 * @param {http.ClientRequest} req
	 * <code>
		{

		}
	* </code>
	*
	* @param {http.ClientResponse} res
	* <code>
		{

		}
	* </code>
	*
	* @example
	* <code>
		http://localhost:8888/find?brand=varihope&page=1
	* </code>
	*/
	global.server.addRouter("/getFtrdDataByCd",function( req, res ){
		
		var routerNm = req.url.split("?")[0];
		var paramsO = paramToObject( req.url );
		var _tdbjs_nm = "getFtrdDataByCd";
				

		res.statusCode = 200;
		res.setHeader( "Access-Control-Allow-Headers", "Content-Type" );
		res.setHeader( "Access-Control-Allow-Origin", "*" );
		res.setHeader( "Access-Control-Allow-Methods", "OPTIONS,POST,GET" );
		res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'})
		
		console.log( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ); 
		
		try
		{
			var _tQuery = fs.readFileSync( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ).toString();
		}
		catch( err )
		{
			console.log( routerNm + " - DBJS File Not Found! - " + err );
			res.end("{ sucess : 0, data : null }");
		}

		var lidx = 0;
		if( paramsO.lidx ) lidx = paramsO.lidx;
		var limit = 100;
		if( paramsO.limit ) limit = paramsO.limit;
		var query = _tQuery
			.replace( "<!=COL_NM=!>", paramsO.date )
			.replace( "<!=CD=!>", paramsO.cd )
			//.replace( "<!=LIMIT=!>", limit );
			
		var dbjs_nm = "getFtrdDataByCd.dbjs";

		var FILE_PATH = DBJS_DIRECTORY_PATH + dbjs_nm;
		
		//console.log( FILE_PATH )

		fs.writeFileSync( DBJS_DIRECTORY_PATH + dbjs_nm , query, { flag : "w" } );
		var r = exec_query_DB( dbjs_nm )
		res.end(  r  )

	});

		/**
	 * 쿼리파일을 실행하는 라우터
	 * @function
	 * @param {http.ClientRequest} req
	 * <code>
		{

		}
	* </code>
	*
	* @param {http.ClientResponse} res
	* <code>
		{

		}
	* </code>
	*
	* @example
	* <code>
		http://localhost:8888/getInsightByStockAvg?cd=000660
	* </code>
	*/
	global.server.addRouter("/getInsightByStockAvg",function( req, res ){
		
		var routerNm = req.url.split("?")[0];
		var paramsO = paramToObject( req.url );
		var _tdbjs_nm = "getInsightByStockAvg";
				

		res.statusCode = 200;
		res.setHeader( "Access-Control-Allow-Headers", "Content-Type" );
		res.setHeader( "Access-Control-Allow-Origin", "*" );
		res.setHeader( "Access-Control-Allow-Methods", "OPTIONS,POST,GET" );
		res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'})
		
		console.log( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ); 
		
		try
		{
			var _tQuery = fs.readFileSync( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ).toString();
		}
		catch( err )
		{
			console.log( routerNm + " - DBJS File Not Found! - " + err );
			res.end("{ sucess : 0, data : null }");
		}

		var query = _tQuery
			.replace( "<!=CD=!>", paramsO.cd )
			//.replace( "<!=LIMIT=!>", limit );
			
		var dbjs_nm = "getInsightByStockAvg.dbjs";

		var FILE_PATH = DBJS_DIRECTORY_PATH + dbjs_nm;
		
		//console.log( FILE_PATH )

		fs.writeFileSync( DBJS_DIRECTORY_PATH + dbjs_nm , query, { flag : "w" } );
		var r = exec_query_DB( dbjs_nm )
		res.end(  r  )

	});

	/**
	 * 쿼리파일을 실행하는 라우터
	 * @function
	 * @param {http.ClientRequest} req
	 * <code>
		{

		}
	* </code>
	*
	* @param {http.ClientResponse} res
	* <code>
		{

		}
	* </code>
	*
	* @example
	* <code>
		http://localhost:8888/find?brand=varihope&page=1
	* </code>
	*/
	global.server.addRouter("/getTrdData_buy",function( req, res ){
		
		var routerNm = req.url.split("?")[0];
		var paramsO = paramToObject( req.url );
		var _tdbjs_nm = "getTrdData_buy";
				

		res.statusCode = 200;
		res.setHeader( "Access-Control-Allow-Headers", "Content-Type" );
		res.setHeader( "Access-Control-Allow-Origin", "*" );
		res.setHeader( "Access-Control-Allow-Methods", "OPTIONS,POST,GET" );
		res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'})
		
		console.log( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ); 
		
		try
		{
			var _tQuery = fs.readFileSync( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ).toString();
		}
		catch( err )
		{
			console.log( routerNm + " - DBJS File Not Found! - " + err );
			res.end("{ sucess : 0, data : null }");
		}

		if( paramsO.date )
		{
			var date = paramsO.date;
		}
		else
		{
			var date = dateFormat_YYMMDD();
		}
		
			
		var lidx = 0;
		if( paramsO.lidx ) lidx = paramsO.lidx;
		var limit = 100;
		if( paramsO.limit ) limit = paramsO.limit;
		var query = _tQuery
			.replace( "<!=DATE=!>", date)
			.replace( "<!=SORT=!>", paramsO.sort);
			//.replace( "<!=TYPE=!>", paramsO.type )
			//.replace( "<!=LIMIT=!>", limit );
			
		var dbjs_nm = "getTrdData_buy.dbjs";

		var FILE_PATH = DBJS_DIRECTORY_PATH + dbjs_nm;
		
		//console.log( FILE_PATH )

		fs.writeFileSync( DBJS_DIRECTORY_PATH + dbjs_nm , query, { flag : "w" } );
		var r = exec_query_DB( dbjs_nm )

		res.end(  r  )

	});

	/**
	 * 쿼리파일을 실행하는 라우터
	 * @function
	 * @param {http.ClientRequest} req
	 * <code>
		{

		}
	* </code>
	*
	* @param {http.ClientResponse} res
	* <code>
		{

		}
	* </code>
	*
	* @example
	* <code>
		http://localhost:8888/find?brand=varihope&page=1
	* </code>
	*/
	global.server.addRouter("/getTrdData_sell",function( req, res ){
		
		var routerNm = req.url.split("?")[0];
		var paramsO = paramToObject( req.url );
		var _tdbjs_nm = "getTrdData_sell";
				

		res.statusCode = 200;
		res.setHeader( "Access-Control-Allow-Headers", "Content-Type" );
		res.setHeader( "Access-Control-Allow-Origin", "*" );
		res.setHeader( "Access-Control-Allow-Methods", "OPTIONS,POST,GET" );
		res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'})
		
		console.log( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ); 
		
		try
		{
			var _tQuery = fs.readFileSync( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ).toString();
		}
		catch( err )
		{
			console.log( routerNm + " - DBJS File Not Found! - " + err );
			res.end("{ sucess : 0, data : null }");
		}

		if( paramsO.date )
		{
			var date = paramsO.date;
		}
		else
		{
			var date = dateFormat_YYMMDD();
		}
		
			
		var lidx = 0;
		if( paramsO.lidx ) lidx = paramsO.lidx;
		var limit = 100;
		if( paramsO.limit ) limit = paramsO.limit;
		var query = _tQuery
			.replace( "<!=DATE=!>", date)
			.replace( "<!=SORT=!>", paramsO.sort);
			//.replace( "<!=TYPE=!>", paramsO.type )
			//.replace( "<!=LIMIT=!>", limit );
			
		var dbjs_nm = "getTrdData_sell.dbjs";

		var FILE_PATH = DBJS_DIRECTORY_PATH + dbjs_nm;
		
		//console.log( FILE_PATH )

		fs.writeFileSync( DBJS_DIRECTORY_PATH + dbjs_nm , query, { flag : "w" } );
		var r = exec_query_DB( dbjs_nm )

		res.end(  r  )

	});

/**
	 * 쿼리파일을 실행하는 라우터
	 * @function
	 * @param {http.ClientRequest} req
	 * <code>
		{

		}
	* </code>
	*
	* @param {http.ClientResponse} res
	* <code>
		{

		}
	* </code>
	*
	* @example
	* <code>
		http://localhost:8888/find?brand=varihope&page=1
	* </code>
	*/
	global.server.addRouter("/getTrdData_pp",function( req, res ){
		
		var routerNm = req.url.split("?")[0];
		var paramsO = paramToObject( req.url );
		var _tdbjs_nm = "getTrdData_pp";
				

		res.statusCode = 200;
		res.setHeader( "Access-Control-Allow-Headers", "Content-Type" );
		res.setHeader( "Access-Control-Allow-Origin", "*" );
		res.setHeader( "Access-Control-Allow-Methods", "OPTIONS,POST,GET" );
		res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'})
		
		console.log( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ); 
		
		try
		{
			var _tQuery = fs.readFileSync( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ).toString();
		}
		catch( err )
		{
			console.log( routerNm + " - DBJS File Not Found! - " + err );
			res.end("{ sucess : 0, data : null }");
		}

		if( paramsO.date )
		{
			var date = paramsO.date;
		}
		else
		{
			var date = dateFormat_YYMMDD();
		}
		
			
		var lidx = 0;
		if( paramsO.lidx ) lidx = paramsO.lidx;
		var limit = 100;
		if( paramsO.limit ) limit = paramsO.limit;
		var query = _tQuery
			.replace( "<!=DATE=!>", date)
			.replace( "<!=SORT=!>", paramsO.sort);
			//.replace( "<!=TYPE=!>", paramsO.type )
			//.replace( "<!=LIMIT=!>", limit );
			
		var dbjs_nm = "getTrdData_pp.dbjs";

		var FILE_PATH = DBJS_DIRECTORY_PATH + dbjs_nm;
		
		//console.log( FILE_PATH )

		fs.writeFileSync( DBJS_DIRECTORY_PATH + dbjs_nm , query, { flag : "w" } );
		var r = exec_query_DB( dbjs_nm )

		res.end(  r  )

	});

	/**
	 * 쿼리파일을 실행하는 라우터
	 * @function
	 * @param {http.ClientRequest} req
	 * <code>
		{

		}
	* </code>
	*
	* @param {http.ClientResponse} res
	* <code>
		{

		}
	* </code>
	*
	* @example
	* <code>
		http://localhost:8888/find?brand=varihope&page=1
	* </code>
	*/
	global.server.addRouter("/getInterestStockByDate",function( req, res ){
		
		var routerNm = req.url.split("?")[0];
		var paramsO = paramToObject( req.url );
		var _tdbjs_nm = "getInterestStockByDate";
				

		res.statusCode = 200;
		res.setHeader( "Access-Control-Allow-Headers", "Content-Type" );
		res.setHeader( "Access-Control-Allow-Origin", "*" );
		res.setHeader( "Access-Control-Allow-Methods", "OPTIONS,POST,GET" );
		res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'})
		
		console.log( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ); 
		
		try
		{
			var _tQuery = fs.readFileSync( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ).toString();
		}
		catch( err )
		{
			console.log( routerNm + " - DBJS File Not Found! - " + err );
			res.end("{ sucess : 0, data : null }");
		}

		if( paramsO.date )
		{
			var date = paramsO.date;
		}
		else
		{
			var date = dateFormat_YYMMDD();
		}
		
			
		var lidx = 0;
		if( paramsO.lidx ) lidx = paramsO.lidx;
		var limit = 100;
		if( paramsO.limit ) limit = paramsO.limit;
		var query = _tQuery
			.replace( "<!=DATE=!>", date)
			//.replace( "<!=SORT=!>", paramsO.sort)
			//.replace( "<!=CD=!>", paramsO.cd )
			//.replace( "<!=LIMIT=!>", limit );
			
		var dbjs_nm = "getInterestStockByDate.dbjs";

		var FILE_PATH = DBJS_DIRECTORY_PATH + dbjs_nm;
		
		//console.log( FILE_PATH )

		fs.writeFileSync( DBJS_DIRECTORY_PATH + dbjs_nm , query, { flag : "w" } );
		var r = exec_query_DB( dbjs_nm )

		res.end(  r  )

	});
	/**
	 * 쿼리파일을 실행하는 라우터
	 * @function
	 * @param {http.ClientRequest} req
	 * <code>
		{

		}
	* </code>
	*
	* @param {http.ClientResponse} res
	* <code>
		{

		}
	* </code>
	*
	* @example
	* <code>
		http://localhost:8888/find?brand=varihope&page=1
	* </code>
	*/
	global.server.addRouter("/getTradeValueByCd",function( req, res ){
		
		var routerNm = req.url.split("?")[0];
		var paramsO = paramToObject( req.url );
		var _tdbjs_nm = "getTradeValueByCd";
				

		res.statusCode = 200;
		res.setHeader( "Access-Control-Allow-Headers", "Content-Type" );
		res.setHeader( "Access-Control-Allow-Origin", "*" );
		res.setHeader( "Access-Control-Allow-Methods", "OPTIONS,POST,GET" );
		res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'})
		
		//console.log( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ); 
		
		try
		{
			var _tQuery = fs.readFileSync( _tDbjs_PATH + "/" + _tdbjs_nm + ".tdbjs" ).toString();
		}
		catch( err )
		{
			console.log( routerNm + " - DBJS File Not Found! - " + err );
			res.end("{ sucess : 0, data : null }");
		}

		if( paramsO.date )
		{
			var date = paramsO.date;
		}
		else
		{
			var date = dateFormat_YYMMDD();
		}
		
			
		var lidx = 0;
		if( paramsO.lidx ) lidx = paramsO.lidx;
		var limit = 100;
		if( paramsO.limit ) limit = paramsO.limit;
		var query = _tQuery
			.replace( "<!=DATE=!>", date)
			//.replace( "<!=SORT=!>", paramsO.sort)
			.replace( "<!=CD=!>", paramsO.cd )
			//.replace( "<!=LIMIT=!>", limit );
			
		var dbjs_nm = "getTradeValueByCd.dbjs";

		var FILE_PATH = DBJS_DIRECTORY_PATH + dbjs_nm;
		
		//console.log( FILE_PATH )

		fs.writeFileSync( DBJS_DIRECTORY_PATH + dbjs_nm , query, { flag : "w" } );
		var r = exec_query_DB( dbjs_nm )

		res.end(  r  )

	});
})();

//-------------------------------------------------------;
if( console ) console.log( "[ E ] - " + fileNm + "----------" );
//-------------------------------------------------------;
