function Genome_Properties_Tree(genome_properties_json)
{
    this.sample_names = genome_properties_json['sample_names'];
    this.tree = genome_properties_json['property_tree'];
    this.node_index = create_node_index(this.tree);
    doubly_link_tree(this.tree);

    this.nodes = function () {return get_nodes(this.tree);};
    this.leafs = function () {return get_leafs(this.tree);};
    this.leaf_data = function () {return get_leaf_data(this.tree, this.sample_names);};
    this.number_of_leaves = function () {return get_number_of_leaves(this.tree);};
    this.max_nodes_to_leaf = function () {return max_node_to_leaf(this.leafs());};
    this.tree_no_leaves = function () {return tree_no_leaves(this.tree);};

    this.switch_node_and_children_enabled_state = function (node_id) {
        switch_node_and_children_enabled_state(node_id, this.node_index);
    };

    function create_node_index(genome_properties_tree)
    {
        let node_index = {};
        let node_identifier = 0;

        let nodes = get_nodes(genome_properties_tree);

        for (let node in nodes)
        {
            let current_property = nodes[node];
            current_property.node_id = node_identifier;
            node_index[node_identifier] = current_property;
            node_identifier++;
        }

        return node_index
    }

    function doubly_link_tree(current_property)
    {
        if (current_property.children !== undefined)
        {
            let children = current_property.children;
            for (let child in children)
            {
                let child_property = children[child];

                child_property.parent = current_property;
                doubly_link_tree(child_property);
            }
        }
    }

    function undoubly_link_tree(current_property)
    {
        if (current_property.parent !== undefined)
        {
            current_property.parent = undefined
        }

        if (current_property.children !== undefined)
        {
            let children = current_property.children;
            for (let child in children)
            {
                undoubly_link_tree(children[child]);
            }
        }
    }

    function get_nodes(current_property, only_leaves = false)
    {
        let nodes = [];
        let property_is_enabled = true;

        let property_has_children = (current_property.children !== undefined);

        if (only_leaves === true)
        {
            property_is_enabled = current_property.enabled;
        }

        if (property_has_children && property_is_enabled)
        {
            let children = current_property.children;
            for (let child in children)
            {
                const child_node_data = get_nodes(children[child], only_leaves);
                nodes = nodes.concat(child_node_data);
            }
        }
        else
        {
            nodes.push(current_property);
        }

        if ((only_leaves !== true) && property_has_children)
        {
            nodes.push(current_property);
        }

        return nodes
    }

    function get_leafs(current_property)
    {
        return get_nodes(current_property, true)
    }

    function get_number_of_leaves(current_property)
    {
        return get_leafs(current_property).length;
    }

    function get_leaf_data(genome_properties_tree, sample_names)
    {
        let heatmap_data = [];
        let leaf_nodes = get_leafs(genome_properties_tree);
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

    function max_node_to_leaf(leafs)
    {
        let global_max_node_hop = 0;
        for (let leaf_index in leafs)
        {
            let leaf = leafs[leaf_index];

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

    function switch_node_and_children_enabled_state(node_id, node_index)
    {
        let current_genome_property = node_index[node_id];
        let enabled_property = 'enabled';
        let enable_state = !current_genome_property[enabled_property];

        apply_attribute_node_and_children(current_genome_property, enabled_property, enable_state);
    }

    function apply_attribute_node_and_children(current_property, property_name, property_value)
    {
        current_property[property_name] = property_value;

        if ((current_property.children !== undefined))
        {
            let children = current_property.children;
            for (let child in children)
            {
                apply_attribute_node_and_children(children[child], property_name, property_value);
            }
        }
    }

    function tree_no_leaves(genome_properties_tree)
    {
        undoubly_link_tree(genome_properties_tree);
        let pruned_genome_properties_tree = jQuery.extend(true, {}, genome_properties_tree);
        doubly_link_tree(genome_properties_tree);
        doubly_link_tree(pruned_genome_properties_tree);
        prune_all_leafs(pruned_genome_properties_tree);

        return pruned_genome_properties_tree
    }

    function prune_all_leafs(current_property)
    {
        if (current_property.children !== undefined)
        {
            let children = current_property.children;
            for (let child in children)
            {
                prune_all_leafs(children[child]);
            }
        }
        else
        {
            let parent = current_property.parent;

            if (parent !== undefined)
            {
                parent.children = undefined;
            }
        }
    }
}
