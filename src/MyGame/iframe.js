/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function hide(name)
{
   iframe = $(name);
   iframe.hide();
}  

function show(name)
{
   iframe = $(name);
   iframe.show();
} 

function refresh(name)
{
   iframe = $(name);
   iframe.attr('src', iframe.attr('src'));
} 

