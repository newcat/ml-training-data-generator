# Nodes

## Value Nodes
Value Nodes can be used to provide the same value to different nodes, similar to a variable in a programming language. The only special node in this category is the *Index Value Node*, which outputs the current index in the batch generation process.

* **Boolean Value Node**
* **Number Value Node**
* **String Value Node**
* **Index Value Node**

## Random Nodes
Random nodes provide random numeric values. All random nodes can be seeded, which will ensure that the same value is generated for the same index in the batch generation process. Optionally, the `Discrete` option can be set, which will round the calculated value to the nearest integer.

* **Uniform Node**: Provides uniformly distributed values between `Min` and `Max` (inclusive)
* **Normal Node**: Provides normally distributed values with the specified `Mean` and `Std. Dev.` (standard deviation) values
* **Exponential Node**: Provides exponentially distributed values with the specified `Lambda` value.
* **Custom Distribution Node**: Allows to set a custom distribution function.
* **Percentage Node**: Will add a random value between plus or minus `inputValue * (Percentage / 100)` to the input value.

## General Nodes

### Function Node
The function node can be used to specify a custom function in JavaScript. The values are provided in the `this` object. The code should return an object that has the names of the output interfaces as keys with their corresponding values.

### Constraint Node
This node can be used to prevent certain values from being generated. This node has a single boolean input. If this input is false, the currently generated data point will be recalculated. However, the same index will be used for the recalculation. This means, if all random nodes are seeded or there is no random node in the system, it would result in an infinite loop. To prevent this, a check is implemented, that automatically cancels the whole batch calculation process if constraint nodes cause over 1000 sequential recalculations.

### Output Node
The output node represents a column in the output data. The label of the column can be set with the `Label` property.
> Note: It is not possible to have multiple columns with the same label. The different nodes will override eachothers values.

### Other Nodes
* **Boolean Node**: Compares two numeric values
* **Math Node**: Performs a mathematic operation on one or two input values
* **String List Node**: Selects a string out of a list of string, depending on the input index (zero based). The strings must be separated by a newline character.