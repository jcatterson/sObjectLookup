/* Dependent on JQuery
*  Also requires a method in Salesforce called "SendEmailWithSF_Attachments.query" -> ( List<String> columnNames, String sobjectName, Map<String, String>{ "whereClause" : "fieldName", "whereValue" : "fieldValue" )
*/
function SObjectLookup( markup, headers, sobjectType, whereFilter ){
    this.headers = headers;
    this.sobjectType = sobjectType;
    this.markup = markup;
    this.the_search_section;
    this.whereFilter = whereFilter;

    this.clearSearch = function(){
        return this.the_search_section.find( '#theBody' ).html("");
    }

    this.showSObjectSearch = function(){
        jQuery('#to_dialog').show();
        this.showLookup( this.the_search_section );
    }

    this.rowSelected = function( the_data ){
        var id = the_data["id"];
        var clicked_on = the_data["clicked_on"];
        this.itemSelected( {id:id, clicked_on:clicked_on, sobjectLookup: this} );
    }

    this.generateMarkup = function( toAppendTo ){
        var html = '<img src="/s.gif" alt="To Lookup (New Window)" class="lookupIcon"></img>';
        html = jQuery( html );
        html.click( this, function(evt){
            evt.data.showSObjectSearch();
        });
        var searchPanel = 
        '<div id="to_dialog">' + 
        '   <div>' + 
        '       <div id="title">' + 
        '           <img src="/s.gif" class="giant_magnifying_glass"></img>' +
        '           <span id="lookup_title">' + 
        '               <h1>Lookup</h1>' + 
        '           </span>' + 
        '       </div>' + 
        '       <div>' + 
        '           <input field="text" class="searchText"></input>' + 
        '           <input type="button" value="Go!" id="searchSobjectsBtn"></input>' + 
        '       </div>' + 
        '       <div>' + 
        '           <span>You can use "*" as a wildcard next to other characters to improve your search results.</span>' + 
        '       </div>' + 
        '   </div>' + 
  
        '   <div id="searchSection">' + 
        '       <a id="clearSearchLink">Clear Search Results</a>' + 
        '   </div>' + 
        '   <div id="searchResults">' + 
        '      <h2>Search Results</h2>' + 
        '      <div id="searchResultList" class="listRelatedObject lookupBlock">' +
        '          <div class="bPageBlock brandSecondaryBrd secondaryPalette">' +
        '              <div class="pbHeader"></div>' +
        '              <div class="pbBody">' +
        '                  <table class="list" border="0" cellspacing="0" cellpadding="0">' +
        '                      <tbody id="theBody"></tbody>' +
        '                  </table>' +
        '              </div>' +
        '          </div>' +
        '      </div>' +
        '   </div>' +
        '</div>';
        searchPanel = jQuery( searchPanel );
        searchPanel.find('#searchSobjectsBtn').click( this, function(evt){
            var search = evt.data.the_search_section.find(".searchText").val();
            evt.data.search( search );
        });
        searchPanel.find( '#searchSection' ).click(this, function(evt){
            evt.data.clearSearch();
        });
        toAppendTo.append( html );
        this.the_search_section = searchPanel;
        toAppendTo.after( searchPanel );
    }

    this.fillResultsTable = function(res){
        if( res.length == 0 ) {
            this.clearSearch();
            return;
        }

        var header_html = this.fillHeaders(res);
        var all_rows = this.fillRows( res );
        all_rows = jQuery( all_rows );
        for( var i = 0; i < all_rows.length; i++ ){

            all_rows.eq(i).find( '.selectableRow' ).click( this, function(evt){
                var row = jQuery( this );
                var id = row.data( 'row-id' );
                var clicked_on = row.find(".selectLink").html();
                evt.data.rowSelected( {id:id, clicked_on: clicked_on} );
            });
        }
        this.clearSearch().append( header_html ).append( all_rows );
    }

    this.fillHeaders = function( res ){
        var header_html = "<tr>";
        var used_headers = [];
        for( var i = 0; i < this.headers.length; i++ ){
            var columnName = this.headers[i];
            if( res[0][columnName] && columnName){
                header_html += '<th scope="col" class="zen-deemphasize">' + columnName + '</th>';
                used_headers.push( columnName );
            }
        }
        header_html += '</tr>';
        return header_html;
    }

    this.fillRows = function(res){
        var all_rows = "";
        for( var i = 0; i < res.length; i++ ){
            var number_headers = 0;
            var row = '<tr class="dataRow">'
            for( var j = 0; j < this.headers.length; j++ ){
                var columnName = this.headers[j];
                if( res[i][columnName] ){
                    if( number_headers == 0 ){
                        row += '<td>' +
                               '    <div class="selectableRow" data-row-id="' + res[i]["Id"] + '">' +
                               '        <a class="selectLink">' + res[i][columnName]  + '</a>' +
                               '    </div>' +
                               '</td>';
                    }
                    else{
                        row += "<td>" + res[i][columnName]  + '</td>';
                    }
                    number_headers++;
                }
            }
            row += '</tr>';
            all_rows += row;
        }
        return all_rows;
    }

    this.search = function( searchValue ){
        this.query = function(self, searchValue){
            var self = self;
            var searchValue = searchValue;
            SendEmailWithSF_Attachments.query(  self.headers, self.sobjectType, {whereColumn: self.whereFilter, whereValue:searchValue}, function(result, res){
                self.fillResultsTable( result );
            });
        }
        this.query( this, searchValue );
    }

    this.generateMarkup( markup );
}