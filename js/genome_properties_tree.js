/**
 * Created by: Lee Bergstrand (2018)
 * Description: An object for representing the genome properties tree.
 */


/**
 * A function to be used as a class for representing the genome properties tree.
 *
 * @param {object} genome_properties_json: The raw json of
 * @constructor
 */
function Genome_Properties_Tree(genome_properties_json)
{
    this.sample_names = genome_properties_json['sample_names'];
    this.tree = genome_properties_json['property_tree'];
    this.node_index = create_node_index(this.tree);
    add_child_to_parent_links(this.tree);

    this.nodes = function () {return get_nodes(this.tree);};
    this.leafs = function () {return get_leaf_nodes(this.tree);};
    this.leaf_data = function () {return get_heatmap_data(this.tree, this.sample_names);};
    this.number_of_leaves = function () {return get_number_of_leaf_nodes(this.tree);};
    this.max_nodes_to_leaf = function () {return get_max_tree_depth(this.tree);};
    this.tree_no_leaves = function () {return get_genome_properties_tree_with_leaves_removed(this.tree);};
    this.leaf_parents = function () {return global_leaf_parents(this.tree);};
    this.switch_node_and_children_enabled_state = function (node_id) {
        invert_child_enabled_state(this.node_index, node_id);
    };

    /**
     * Creates a object which points to every node in the genome properties tree. The each node is keyed by node id.
     *
     * @param {object} root_genome_properties_node: The root node of the genome properties tree.
     * @return {object} An object, keyed by node_id, which points to every node in the genome properties tree.
     */
    function create_node_index(root_genome_properties_node)
    {
        let node_index = {};
        let node_identifier = 0;

        let all_nodes = get_nodes(root_genome_properties_node);

        for (let node in all_nodes)
        {
            let current_property = all_nodes[node];
            current_property.node_id = node_identifier;
            node_index[node_identifier] = current_property;
            node_identifier++;
        }

        return node_index
    }

    /**
     * Adds reverse links from child to parent to each genome properties tree node.
     *
     * @param {object} root_genome_properties_node: The root node of the genome properties tree.
     */
    function add_child_to_parent_links(root_genome_properties_node)
    {
        if (root_genome_properties_node.children !== undefined)
        {
            let children = root_genome_properties_node.children;
            for (let child in children)
            {
                let child_property = children[child];

                child_property.parent = root_genome_properties_node;
                add_child_to_parent_links(child_property);
            }
        }
    }

    /**
     * Removes reverse links from child to parent from each genome properties tree node.
     *
     * @param {object} root_genome_properties_node: The root node of the genome properties tree.
     */
    function remove_child_to_parent_links(root_genome_properties_node)
    {
        if (root_genome_properties_node.parent !== undefined)
        {
            root_genome_properties_node.parent = undefined
        }

        if (root_genome_properties_node.children !== undefined)
        {
            let children = root_genome_properties_node.children;
            for (let child in children)
            {
                remove_child_to_parent_links(children[child]);
            }
        }
    }

    /**
     * Gets all the leaf nodes of the genome properties tree.
     *
     * @param {object} root_genome_properties_node: The root node of the genome properties tree.
     * @return {array} An array of leaf nodes.
     */
    function get_leaf_nodes(root_genome_properties_node)
    {
        return get_nodes(root_genome_properties_node, true)
    }

    /**
     * Gets the number leaf nodes of the genome properties tree.
     *
     * @param {object} root_genome_properties_node: The root node of the genome properties tree.
     * @return {number} The number of leaf nodes.
     */
    function get_number_of_leaf_nodes(root_genome_properties_node)
    {
        return get_leaf_nodes(root_genome_properties_node).length;
    }

    /**
     * Gets all the nodes in the genome properties tree.
     *
     * @param {object} root_genome_properties_node: The root node of the genome properties tree.
     * @param {boolean} only_leaves: If true, return leaf nodes only.
     * @return {array} An array of every node.
     */
    function get_nodes(root_genome_properties_node, only_leaves = false)
    {
        let nodes = [];
        let property_is_enabled = true;

        let property_has_children = (root_genome_properties_node.children !== undefined);

        if (only_leaves === true)
        {
            property_is_enabled = root_genome_properties_node.enabled;
        }

        if (property_has_children && property_is_enabled)
        {
            let children = root_genome_properties_node.children;
            for (let child in children)
            {
                const child_node_data = get_nodes(children[child], only_leaves);
                nodes = nodes.concat(child_node_data);
            }
        }
        else
        {
            nodes.push(root_genome_properties_node);
        }

        if ((only_leaves !== true) && property_has_children)
        {
            nodes.push(root_genome_properties_node);
        }

        return nodes
    }

    /**
     * Gets all the leaf nodes of the genome properties tree, however, disregards parents being disabled.
     *
     * @param {object} root_genome_properties_node: The root node of the genome properties tree.
     * @return {Array} An array of leaf nodes.
     */
    function get_global_leaf_nodes(root_genome_properties_node)
    {
        let nodes = [];
        if (root_genome_properties_node.children !== undefined)
        {
            let children = root_genome_properties_node.children;
            for (let child in children)
            {
                const child_node_data = get_global_leaf_nodes(children[child]);
                nodes = nodes.concat(child_node_data);
            }
        }
        else
        {
            nodes.push(root_genome_properties_node);
        }

        return nodes;
    }

    /**
     * Gets all the parents of the leaf nodes of the genome properties tree, however, disregards parents being disabled.
     *
     * @param {object} root_genome_properties_node: The root node of the genome properties tree.
     * @return {Array} An array of parents of the leaf nodes.
     */
    function global_leaf_parents(root_genome_properties_node)
    {
        let leafs = get_global_leaf_nodes(root_genome_properties_node);

        let parents = [];
        for (let leaf_index in leafs) {
            let leaf_property = leafs[leaf_index];
            let leaf_parent = leaf_property.parent;
            let parent_already_seen = $.inArray(leaf_parent, parents);
            if (parent_already_seen === -1){
                parents.push(leaf_parent)
            }
        }

        return parents
    }

    /**
     * Gets data for each cell in the heatmap.
     *
     * @param {object} root_genome_properties_node: The root node of the genome properties tree.
     * @param {array} sample_names: The names of the samples to be used for the x-axis of the heatmap.
     * @return {array} An array of objects representing each heatmap cell.
     */
    function get_heatmap_data(root_genome_properties_node, sample_names)
    {
        let heatmap_data = [];
        let leaf_nodes = get_leaf_nodes(root_genome_properties_node);
        let number_of_samples = sample_names.length;

        for (let node in leaf_nodes)
        {
            let current_leaf_node = leaf_nodes[node];
            let current_leaf_node_sample_results = current_leaf_node['result'];

            let sample_name_counter = 0;
            for (let result_index in current_leaf_node_sample_results)
            {

                let heatmap_cell_data = {};
                heatmap_cell_data.propertyName = current_leaf_node['name'];
                heatmap_cell_data.genome = sample_names[sample_name_counter];
                heatmap_cell_data.propertyStatus = current_leaf_node_sample_results[result_index];

                heatmap_data.push(heatmap_cell_data);

                if (sample_name_counter === (number_of_samples - 1))
                {
                    sample_name_counter = 0
                }
                else
                {
                    sample_name_counter++
                }
            }
        }

        return heatmap_data
    }

    /**
     * In the genome properties tree, not all leaf nodes are at the same level. There are more hops from root
     * to leaf for some branches than others. This function finds the longest route from root to leaf in the tree and
     * records of nodes that it passes through.
     *
     * @param {object} root_genome_properties_node: The root node of the genome properties tree.
     * @return {number} The maximum number of nodes from root to leaf.
     */
    function get_max_tree_depth(root_genome_properties_node)
    {
        let leaf_nodes = get_leaf_nodes(root_genome_properties_node);

        let global_max_node_hop = 0;
        for (let leaf_index in leaf_nodes)
        {
            let leaf = leaf_nodes[leaf_index];

            let current_leaf_parent_hopes = 0;

            while (leaf.parent !== undefined)
            {
                current_leaf_parent_hopes += 1;
                leaf = leaf.parent;
            }

            if (current_leaf_parent_hopes > global_max_node_hop)
            {
                global_max_node_hop = current_leaf_parent_hopes
            }
        }

        return global_max_node_hop
    }

    /**
     * For a given parent node, flip all child nodes enabled state.
     *
     * @param {object} node_index: An object, keyed by node_id, which points to every node in the genome properties tree.
     * @param {number} parent_node_id: The unique node identifier of the parent genome property.
     */
    /* TODO: Could inverting the child's state turn on nodes that we don't want on? */
    function invert_child_enabled_state(node_index, parent_node_id)
    {
        let current_genome_property = node_index[parent_node_id];
        let children = current_genome_property.children;
        if (children !== undefined) {
            for (let child_index in children){
                let current_child_property = children[child_index];
                current_child_property.enabled = !current_child_property.enabled;
            }
        }
    }

    /**
     * Strips the leafs from a genome properties the tree. The parents of these leafs become the new leafs.
     *
     * @param {object} root_genome_properties_node: The root node of the genome properties tree.
     * @return {object} A deep copy of the original tree with the leafs removed.
     */
    function get_genome_properties_tree_with_leaves_removed(root_genome_properties_node)
    {
        remove_child_to_parent_links(root_genome_properties_node);

        // Deep copy the genome properties tree using jQuery.
        let pruned_genome_properties_tree = $.extend(true, {}, root_genome_properties_node);

        add_child_to_parent_links(root_genome_properties_node);
        add_child_to_parent_links(pruned_genome_properties_tree);
        prune_all_leafs(pruned_genome_properties_tree);

        return pruned_genome_properties_tree
    }

    /**
     * Strips the leafs from a genome properties the tree. The parents of these leafs become the new leafs.
     *
     * @param {object} root_genome_properties_node: The root node of the genome properties tree.
     * @return {object} A the original tree with the leafs removed.
     */
    function prune_all_leafs(root_genome_properties_node)
    {
        let leafs = get_leaf_nodes(root_genome_properties_node);

        for (let leaf_index in leafs) {
            let leaf_property = leafs[leaf_index];
            let leaf_parent = leaf_property.parent;
            let all_parents_children = leaf_parent.children;

            let leafs_index_in_parent = all_parents_children.indexOf(leaf_property);
            if (leafs_index_in_parent > -1) {
                all_parents_children.splice(leafs_index_in_parent, 1);
            }
        }
    }
}
