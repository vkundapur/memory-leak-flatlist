## FlatList Memory Leak Sample

Found this issue while developing one of my apps. The allocation keeps increasing and does not reduce.

Initially the memory footprint is low.
![Initial memory allocation](img-initial.png "Initial memory")

After doing load more few times, the allocation keeps increasing
![Final memory allocation](img-final.png "Initial memory")

[Question posted on Stackoverflow](https://stackoverflow.com/questions/71029189/high-memory-usage-in-react-native-flatlist)
