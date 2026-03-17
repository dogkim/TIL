**reculsive tree**

```C
void MakeTree(int n){
    NODE* node;
    node = (NODE*)malloc(sizeof(NODE));
    node->left = NULL;
    node->right = NULL;
    node->data = n;
    if(n <=5){
        node->left = MakeTree(n*2);
        node->right = MakeTree(n+2);
    }
    
    return node;
}
```

**Reculsive PreOrder, InOrder, PostOrder** 
```C
void PreOrder(NODE* h){
    if(h){
        printf("%d", h->data);
        PreOrder(h->left);
        PreOrder(h->right);
    }
    return;
}
```
```C
void InOrder(NODE* h){
    if(h){
        InOrder(h->left);
        printf("%d",h->data);
        Inorder(h->right);
    }
}
```

**LevelOrder traversal**

```C
NODE* queue[MAX_QUEUE] ={0};
int front = 0 ;
int rear = 0 ;

void Inqueue(NODE* p){
    queue[++rear];
    return;
}

NODE* Dequeue(){
    return queue[++front];
}

void LevelOrderPrint(NODE* h){
    Inqueue(h);
    while(1){
        h = Dequeue();
        if(h){
            print("%d", h->data)
            if(h->left){
                Inqueue(h->left);
            }
            if(h->right){
                Inqueue(h->right);
            }
        }
        else{
            break;
        }
    }
    return;
}
```

levelorder 
일단 head inqueue

h에 dequeue하고
NULL아니면 print
아래있는 left, right가 NULL이 아니면 inqueue

다시 dequeue ... 


