# sObjectLookup
This is a component to mimick Salesforce lookup logic.

Dependencies: jQuery

![Alt text](/sampleImage/sampleImage.jpg?raw=true "Screen Shot example")


###Usage:
Create a new SObjectLookup( the_markup, string_column_array_to_query, the_sObject_table_you_want_to_query, the_field_to_filter_on );

In my sample, I used jQueryUI.  You may choose to implement your own container for sObjectLookup.the_search_section
```
   <apex:page controller="SendEmailWithSF_Attachments">
         <script src="https://code.jquery.com/jquery-2.1.3.min.js"></script>
         <link rel="stylesheet" href="https://code.jquery.com/ui/1.11.3/themes/smoothness/jquery-ui.css"></link>
         <script src="https://code.jquery.com/ui/1.11.3/jquery-ui.js"></script>
         <link rel="stylesheet" href="{!$Resource.sobject_lookup_css}"></link>
         <script src="{!$Resource.sobject_lookup}"></script>
         <script>
            jQuery(function(){
                var sObjectLookup = new SObjectLookup( jQuery('#custom_lookup'), ["Name", "Title", "Phone", "Email"], "Contact", "Name");
                sObjectLookup.itemSelected = function( theSelectedItem ){
                   var id = theSelectedItem["id"];
                   var sobject = theSelectedItem["sobjectLookup"];
                   sobject.the_search_section.dialog('close');
                   var id = theSelectedItem["id"];
                   jQuery("#the_input").val( theSelectedItem["clicked_on"] ).data('sf_id', id);
                };
                sObjectLookup.showLookup = function( the_lookup ){
                    the_lookup.dialog('open');
                };
                sObjectLookup.the_search_section.dialog({
                   autoOpen: false,
                   width: 800,
                   height: 500
                });
            });
         </script>

         <input type="text" id="the_input"></input>
         <span id="custom_lookup"></span>
   </apex:page>
```

define itemSelected( theSelectedItem ) and showLookup( the_lookup ) functions on SObjectLookup.

###Functions for user to implement
 showLookup - is a notification that the magnifying glass has been clicked on.
 
 
 itemSelected - after searching and selecting an item, this function is called; theSelectedItem->{"id":"The Id of the sObject clicked on", "clicked_on":"the actual column clicked on" (In my screenshot, it would be the Name column), "sobjectLookup": "the original SObjectLookup clicked on"}
 
 Lastly, implement the Apex remote action tied to the query that happens in sobject_lookup.js
 ```
public class SendEmailWithSF_Attachments
{
    @RemoteAction
    public static List<sObject> query(List<String> fields, String tableName, Map<String, String> whereField)
    {
        String strFields = String.escapeSingleQuotes( String.join( fields, ',') );
        String whereClause = String.escapeSingleQuotes( whereField.get('whereColumn') );
        String whereValue = String.escapeSingleQuotes( whereField.get('whereValue') );  
        whereValue = whereValue.replaceAll( '[*]', '%' );
        String query = 'Select ' + strFields + ' from ' + tableName + ' where ' + whereClause + ' like \'' + whereValue + '\'';
        return Database.query( query );
    }
}
```


###Known Bugs:

Columns headers that are not visible to the user will still show up, just as empty for each row.  If you would like to remove columns that are not queryable; I suggest before initializing the array for columns to query on SObjectLookup, get a list of fields that are queryable for the particular user.

###Unimplemented:

  THIS does not allow a user to simply type in the related input field to get match by name exactly.
