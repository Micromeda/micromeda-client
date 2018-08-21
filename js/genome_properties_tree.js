function Genome_Properties_Tree(genome_properties_json)
{
    let genome_properties_tree = genome_properties_json['property_tree'];
    const node_index = create_node_index(genome_properties_tree);
    doubly_link_tree(genome_properties_tree);

    this.sample_names = genome_properties_json['sample_names'];
    this.nodes = get_nodes(genome_properties_tree);
    this.node_index = node_index;
    this.tree = genome_properties_tree;
    this.leafs = get_leafs(genome_properties_tree);
    this.leaf_data = get_leaf_data(genome_properties_tree);
    this.number_of_leaves = get_number_of_leaves(genome_properties_tree);
    this.max_nodes_to_leaf = max_node_to_leaf(this.leafs);
    this.switch_node_and_children_enabled_state = switch_node_and_children_enabled_state;

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
        let property_has_children = (current_property.children !== undefined);

        if (property_has_children)
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

    function get_leaf_data(current_property)
    {
        let node_data = [];

        let leaf_nodes = get_leafs(current_property);

        for (let node in leaf_nodes)
        {
            node_data.push({'name': leaf_nodes[node]['name'], 'result': leaf_nodes[node]['result']});
        }

        return node_data
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

    function switch_node_and_children_enabled_state(node_id)
    {
        let genome_property_tree = this;
        let current_genome_property = genome_property_tree.node_index[node_id];

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
}
