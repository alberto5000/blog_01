import {Checkable_Element} from './Checkable_Element.js';
import {List_Element} from './Checkable_Element.js';
'using strict';

{ //--Script scope  
    class Tags
    {
        constructor(tag_name, count = 0)
        {
            this.is_active = false;
            this.tag_name = tag_name;
            this.tags_count = count;
        }
        check()
        {
            this.is_active = !this.is_active;
            console.log("Is active: ", this.is_active);
        }
        to_tag(tag_type)
        {
            return `<${tag_type}>${this.tag_name}</${tag_type}>`;
        }
    }

    let Article_Data = //--Data id enum
    {
        contents:  0,
        authors : 1,
        tags : 2,
        title : 3,
        list_title : 4
    };

    class Article
    {
        constructor(content, authors, tags, title, list_title)
        {
            this.contents = content;
            this.authors = authors;
            this.tags = tags;
            this.title = title;
            this.list_title = list_title;
        }

        get_propriety(type) //--Get data by enum value
        {
            switch(type)
            {
                case Article_Data.contents: return this.contents;
                case Article_Data.authors: return this.authors;
                case Article_Data.tags: return this.tags;
                case Article_Data.title: return this.title;
                case Article_Data.list_title: return this.list_title;
            }
            return undefined;
        }
        list_title_func()
        {
            return this.list_title;
        }
        get_func()
        {
            return this.list_title_func.bind(this);
        }
        to_html()
        {
            let title_temp = `<h1> ${this.title}</h1>`;
            let authors_temp = `<h3>Authors: ${this.authors}</h3>`;
            let contents_temp = `<p>${this.contents}</p>`;
            return title_temp + authors_temp + contents_temp;
        }
    }

    class Article_Handler
    {
        #m_articles;
        #m_found_articles;

        #m_all_tags_filter;
        #m_all_authors_filter;

        #m_tags_container;
        #m_authors_container;
        #m_articles_container;

        constructor()
        {
            this.#m_articles = [];
            this.#m_found_articles = [];
            this.#m_all_tags_filter = [];
            this.#m_all_authors_filter = [];
            this.#m_tags_container = [];
            this.#m_authors_container = [];
            this.#m_articles_container = [];
        }

        realloc_propriety(propriety = null, html_container = '')
        {
            let ptr = this.#get_propriety(propriety);

            for(let i = 0; i  < ptr.length; i++)
            {
                ptr[i].remove_element();
            }
            ptr.length = 0;

            let e = document.getElementById(html_container);
            for(let i = 0; i  < this.#get_propriety_filter(propriety).length; i++)
            {
                let pt = null;
                switch(propriety)
                {
                    case Article_Data.authors:
                        pt = this.#get_propriety_filter(propriety)[i];
                        break;

                    case Article_Data.tags:
                        pt = this.#get_propriety_filter(propriety)[i].tag_name;
                        break;
                }

                if(e != null)
                {
                    ptr.push(new Checkable_Element(document.getElementById(html_container), null, pt, 'div', ['tags-items'], ['obj-disabled'], 
                                                                      '', [this.filter_article.bind(this), this.reload_articles.bind(this, 'titles-list-id')]));
                }
            }
        }

        reload_articles(html_container = null) //--Display articles on list
        {
            this.#m_articles_container.length = 0;
            let e = document.getElementById(html_container);
            e.innerHTML = '';

            for(let i = 0; i < this.#m_found_articles.length; i++)
            {
                if(e != null)
                {
                    this.#m_articles_container.push(new List_Element(e, null, this.#m_found_articles[i].list_title, 'div', ['article-items'], 
                                                                     '', [this.select_article.bind(this, i)]));
                }
            }
        }

        select_article(i)
        {
            document.getElementById('article-container-id').innerHTML  = this.#m_found_articles[i].to_html();
        }

        add_article(a)   
        {
            this.#m_articles.push(a);
            this.update_filter_data(Article_Data.tags);
            this.realloc_propriety(Article_Data.tags, 'tags-container');

            this.update_filter_data(Article_Data.authors);
            this.realloc_propriety(Article_Data.authors, 'authors-container');

            this.filter_article();
            this.reload_articles('titles-list-id');
        }

        filter_article() //--Filter by tags and authors
        {
            this.#m_found_articles.length = 0;
            for(let i = 0; i < this.#m_articles.length; i++)
            {
                let tag_found = false;
                let author_found = false;

                for(let j = 0; j < this.#m_tags_container.length; j++)
                {
                    if(!this.#m_tags_container[j].is_on){continue;}
                    for(let k = 0; k < this.#m_articles[i].tags.length; k++)
                    {
                        if(this.#m_articles[i].tags[k] == this.#m_tags_container[j].content())
                        {
                            tag_found = true;
                            break;
                        }
                    }
                    if(tag_found){break;}
                }

                for(let j = 0; j < this.#m_authors_container.length; j++)
                {
                    if(!this.#m_authors_container[j].is_on){continue;}
                    for(let k = 0; k < this.#m_articles[i].tags.length; k++)
                    {
                        if(this.#m_articles[i].authors[k] == this.#m_authors_container[j].content())
                        {
                            author_found = true;
                            break;
                        }
                    }
                    if(author_found){break;}
                }

                if(tag_found && author_found)
                {
                    this.#m_found_articles.push(this.#m_articles[i]);
                }
            }
        }
        #get_propriety_filter(p)
        {
            switch(p)
            {
                case Article_Data.tags:
                    return this.#m_all_tags_filter;

                case Article_Data.authors:
                    return this.#m_all_authors_filter;
            }
            return undefined;
        }
        #get_propriety(propriety)
        {
            switch(propriety)
            {
                case Article_Data.tags:
                    return this.#m_tags_container;

                case Article_Data.authors:
                    return this.#m_authors_container;
            }
            return undefined;
        }
        update_filter_data(propriety) //--Filter data and page elements
        {
            //--#get_propriety_filter target reciever of genererated data for tags or authors
            this.#get_propriety_filter(propriety).length = 0;
            let arr = [];

            for(let i = 0; i < this.#m_articles.length; i++)
            {
                for(let j = 0; j < this.#m_articles[i].get_propriety(propriety).length; j++)
                {
                    arr.push(this.#m_articles[i].get_propriety(propriety)[j]);
                }
            }

            let unique_arr = [...new Set(arr)]; //--Make unique

            for(let i = 0; i < unique_arr.length; i++)
            {
                let current = unique_arr[i]; //--current search
                let count = 0;

                for(let i = 0; i < arr.length; i++)
                {
                    if(arr[i] == current)
                    {
                        count++;
                    }
                }

                let ptr = null;
                if(propriety == Article_Data.tags)
                {
                    ptr = new Tags(current, count);
                }
                else if(propriety == Article_Data.authors) {ptr = current;}
                else {throw("Error! Invalid propriety in update_tags.")}
                this.#get_propriety_filter(propriety).push(ptr);
            }
        }
    }

    let article_handler = new Article_Handler();

    //--Articles should be stored either in a file or database, but for test only they are hard-coded
    article_handler.add_article(new Article('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', ['Joseph Johnson', 'Ally Philipson'], ['code', 'sports'], 'Article 1', 'Article 1'));
    article_handler.add_article(new Article('Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.', ['Kitty Toebean'], ['design', 'news'], 'Article 2', 'Article 2'));
    article_handler.add_article(new Article('At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.', ['Theo Tabby'], ['news', 'sports'], 'Article 3', 'Article 3'));
    article_handler.add_article(new Article('Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.', ['George Tuxedo', 'Theo Tabby'], ['code', 'sports'], 'Article 4', 'Article 4'));
    article_handler.add_article(new Article('Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.', ['Marion Berry'], ['design', 'tutorials'], 'Article 5', 'Article 5'));

} //--Script scope
