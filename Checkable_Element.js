export class List_Element
{
    //--Protected:
    m_callback_funcs;
    m_parent = null;

    /*
    insert_before - insert before specified element
    content - specified text content
    element - html elemnt type
    class_names - class array for html obj.
    element_id - html obj. id
    callback_funcs - callbacks executed on click
    */
    constructor(parent = null, insert_before = null, content = '', element = 'div', class_names = [], element_id = '', callback_funcs = [])
    {
        this.html_test = document.createElement(element);
        this.m_callback_funcs = [];

        this.html_test.innerText = content;
        this.html_test.id = element_id;
        this.m_callback_funcs = callback_funcs;

        for(let i = 0; i < class_names.length; i++)
        {
            this.html_test.classList.add(class_names[i]);
        }

        this.html_test.onclick = () => 
        {
            for(let i = 0; i < this.m_callback_funcs.length; i++)
            {
                this.m_callback_funcs[i]();
            }
        };

        this.m_parent = parent;
        parent.appendChild(this.html_test);
        parent.insertBefore(this.html_test, insert_before);
    }

    content()
    {
        return this.html_test.innerText;
    }

    remove_element()
    {
        this.m_parent.removeChild(this.html_test);
    }

    add_callback(f)
    {
        this.m_callback_funcs.push(f);
    }
}

export class Checkable_Element extends List_Element
{
    //--Protected:
    m_reverse_class_remove_rule = false; //--Remove disabled class rule

    //--Public:
    is_on = true; //--is checked

    constructor(parent = null, insert_before = null, content = '', element = 'div', class_names = [], removable_classes = [], element_id = '', callback_funcs = [])
    {
        super(parent, insert_before, content, element, class_names, element_id, callback_funcs);
        this.removable_classes = removable_classes;

        for(let i = 0; i < class_names.length; i++)
        {
            this.html_test.classList.add(class_names[i]);
        }

        this.html_test.onclick = () => 
        {
            this.check(); 
            for(let i = 0; i < this.m_callback_funcs.length; i++)
            {
                this.m_callback_funcs[i]();
            }
        };

        this.m_parent = parent;
        parent.appendChild(this.html_test);
        parent.insertBefore(this.html_test, insert_before);
    }

    check()
    {
        this.is_on = !this.is_on;
        this.#switch_classes();
    }
    
    #switch_classes()
    {
        let temp = this.m_reverse_class_remove_rule == true ? !this.is_on : this.is_on;
        if(temp)
        {
            for(let i = 0; i < this.removable_classes.length; i++)
            {
                this.html_test.classList.remove(this.removable_classes[i]);
            } 
        }
        else
        {
            for(let i = 0; i < this.removable_classes.length; i++)
            {
                this.html_test.classList.add(this.removable_classes[i]);
            } 
        }
    } 
}