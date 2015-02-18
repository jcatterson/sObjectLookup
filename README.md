# sObjectLookup
This is a component to mimick Salesforce lookup logic.

Dependencies: jQuery

![Alt text](/imageSample/sampleImage.jpg?raw=true "Screen Shot example")


###Useage:
Create a new SObjectLookup( the_markup, string_column_array_to_query, the_sObject_table_you_want_to_query, the_field_to_filter_on );

define itemSelected( theSelectedItem ) and showLookup( the_lookup ) functions on SObjectLookup.

###Functions for user to implement
 showLookup - is a notification that the magnifying glass has been clicked on.
 
 
 itemSelected - after searching and selecting an item, this function is called; theSelectedItem->{"id":"The Id of the sObject clicked on", "clicked_on":"the actual column clicked on" (In my screenshot, it would be the Name column), "sobjectLookup": "the original SObjectLookup clicked on"}
 
 Lastly, implement the Apex remote action tied to the query that happens in sobject_lookup.js
 ```
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
```


###Known Bugs:

Columns headers for results table might not show if the first row from the result is empty.
  See implementation of fillHeaders function.

###Unimplemented:

  THIS does not allow a user to simply type in the related input field to get match by name exactly.
