using APIAngularASPNet.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace APIAngularASPNet.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PessoasController : ControllerBase
    {
        private readonly Contexto _contexto;

        public PessoasController (Contexto contexto)
        {
            Console.WriteLine("fui chamado");
            _contexto = contexto;
        }
        public async Task<ActionResult<IEnumerable<Pessoa>>> GetAllPessoas()
        {
            Helpers.Uteis.DebugLog("fui chamado no getall pessoas");
            return await _contexto.Pessoas.ToListAsync();
        }

        [Route("{id}")]
        public async Task<ActionResult<Pessoa>> GetById(int id)
        {
            Pessoa pessoa = await _contexto.Pessoas.FindAsync(id);
            if (pessoa != null)
            {
                return Ok(pessoa);
            }
            return BadRequest("Pessoa não encontrada");
        }

        [HttpPost]
        public  async Task<ActionResult<Pessoa>> CadastrarPessoa([FromBody] Pessoa pessoa)
        {
            await _contexto.Pessoas.AddAsync(pessoa);
            await _contexto.SaveChangesAsync();

            return pessoa;
        }

        [HttpPut]
        public async Task<ActionResult> UpdatePessoa ([FromBody] Pessoa pessoaBody)
        {           
                _contexto.Update(pessoaBody);
                await _contexto.SaveChangesAsync();
                return Ok();           
        }

        [HttpDelete]

        [Route("{id}")]
        public async Task<ActionResult<Pessoa>> DeletePessoa(int id)
        {
            Pessoa pessoa = await _contexto.Pessoas.FindAsync(id);
            if (pessoa != null)
            {
                _contexto.Pessoas.Remove(pessoa);
                _contexto.SaveChanges();
                return Ok();
            }
            return BadRequest("Pessoa não encontrada");
        }


    }
}

